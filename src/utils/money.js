const SCALE = 10000;

export function toMinorUnits(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) throw new Error(`Invalid amount: ${amount}`);
  return Math.round(n * SCALE);
}

export function fromMinorUnits(units) {
  return (units / SCALE).toFixed(4);
}

export function parseAmount(amount) {
  return fromMinorUnits(toMinorUnits(amount));
}

export function splitEqually(totalAmount, memberIds) {
  if (!memberIds?.length) throw new Error("Need at least one member");

  const total = toMinorUnits(totalAmount);
  const base = Math.floor(total / memberIds.length);
  let leftover = total - base * memberIds.length;

  return [...memberIds]
    .sort((a, b) => a - b)
    .map((userId) => {
      const share = base + (leftover > 0 ? 1 : 0);
      if (leftover > 0) leftover -= 1;
      return { userId, shareAmount: fromMinorUnits(share) };
    });
}

export function sumShareAmounts(shares) {
  const total = shares.reduce((sum, s) => sum + toMinorUnits(s.shareAmount), 0);
  return fromMinorUnits(total);
}
