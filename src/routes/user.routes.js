import { Router } from "express";
import userController from "../controllers/user.controller";
import requestContext from "../middlewares/request-context.middleware";
import validate from "../middlewares/validate.middleware";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  userIdParamSchema,
} from "../validators/user.validator";

const userRoutes = Router();

userRoutes.post("/register", validate(registerSchema), userController.register);
userRoutes.post("/login", validate(loginSchema), userController.login);
userRoutes.get(
  "/:id",
  requestContext,
  validate(userIdParamSchema, "params"),
  userController.getProfile
);
userRoutes.patch(
  "/:id",
  requestContext,
  validate(userIdParamSchema, "params"),
  validate(updateProfileSchema),
  userController.updateProfile
);
userRoutes.delete(
  "/:id",
  requestContext,
  validate(userIdParamSchema, "params"),
  userController.deleteAccount
);

export { userRoutes };
