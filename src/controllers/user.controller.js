import userService from "../services/user.service";
import { ForbiddenError } from "../utils/ApiError";
import asyncHandler from "../utils/async-handler";

function assertSelf(req) {
  if (Number(req.params.id) !== Number(req.userId)) {
    throw new ForbiddenError("You can only access your own profile");
  }
}

const userController = {
  register: asyncHandler(async (req, res) => {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  }),

  login: asyncHandler(async (req, res) => {
    const user = await userService.login(req.body);
    res.json(user);
  }),

  getProfile: asyncHandler(async (req, res) => {
    assertSelf(req);
    const user = await userService.getProfile(req.userId);
    res.json(user);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    assertSelf(req);
    const user = await userService.updateProfile(req.userId, req.body);
    res.json(user);
  }),

  deleteAccount: asyncHandler(async (req, res) => {
    assertSelf(req);
    await userService.deleteAccount(req.userId);
    res.status(200).json({ msg: "Deleted" });
  }),
};

export default userController;
