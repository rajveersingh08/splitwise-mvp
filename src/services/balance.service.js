import balanceRepository from "../repositories/balance.repository";
import userRepository from "../repositories/user.repository";
import { ValidationError } from "../utils/ApiError";
import { isValidCurrency, normalizeCurrencyCode } from "../utils/currency";
import { fromMinorUnits, toMinorUnits } from "../utils/money";

function buildNetBalances(userId, obligations) {
  const netByCurrency = new Map();

  for (const row of obligations) {
    const amount = toMinorUnits(row.shareAmount);

    if (!netByCurrency.has(row.currency)) {
      netByCurrency.set(row.currency, new Map());
    }

    const byUser = netByCurrency.get(row.currency);

    if (row.debtorId === userId) {
      byUser.set(row.creditorId, (byUser.get(row.creditorId) || 0) + amount);
    } else if (row.creditorId === userId) {
      byUser.set(row.debtorId, (byUser.get(row.debtorId) || 0) - amount);
    }
  }

  return netByCurrency;
}

const balanceService = {
  async getBalances(userId, { currency } = {}) {
    let filterCurrency = null;

    if (currency) {
      filterCurrency = normalizeCurrencyCode(currency);
      if (!isValidCurrency(filterCurrency)) {
        throw new ValidationError("Invalid currency filter");
      }
    }

    const obligations = await balanceRepository.getObligationsForUser(userId, filterCurrency);
    const netByCurrency = buildNetBalances(userId, obligations);

    const counterpartyIds = new Set();
    for (const map of netByCurrency.values()) {
      for (const id of map.keys()) counterpartyIds.add(id);
    }

    const users = await userRepository.findByIds([...counterpartyIds], {
      attributes: ["id", "email"],
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const balancesByCurrency = [];

    for (const [curr, map] of netByCurrency.entries()) {
      const entries = [];
      let totalYouOwe = 0;
      let totalOwedToYou = 0;

      for (const [counterpartyId, net] of map.entries()) {
        if (!net) continue;

        const counterparty = userMap.get(counterpartyId);
        const cp = counterparty
          ? { id: counterparty.id, email: counterparty.email }
          : { id: counterpartyId, email: null };

        if (net > 0) {
          totalYouOwe += net;
          entries.push({ counterparty: cp, amount: fromMinorUnits(net), type: "you_owe" });
        } else {
          totalOwedToYou += Math.abs(net);
          entries.push({
            counterparty: cp,
            amount: fromMinorUnits(Math.abs(net)),
            type: "owes_you",
          });
        }
      }

      entries.sort((a, b) => a.counterparty.id - b.counterparty.id);
      balancesByCurrency.push({
        currency: curr,
        entries,
        summary: {
          totalYouOwe: fromMinorUnits(totalYouOwe),
          totalOwedToYou: fromMinorUnits(totalOwedToYou),
        },
      });
    }

    balancesByCurrency.sort((a, b) => a.currency.localeCompare(b.currency));
    return { balancesByCurrency };
  },
};

export default balanceService;
