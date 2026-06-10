import balanceService from "../services/balance.service";
import asyncHandler from "../utils/async-handler";

const balanceController = {
  getBalances: asyncHandler(async (req, res) => {
    const balances = await balanceService.getBalances(req.userId, req.query);
    res.json(balances);
  }),
};

export default balanceController;
