import userRepository from "../repositories/user.repository";
import { NotFoundError, UnauthorizedError } from "../utils/ApiError";

export default async function requestContext(req, _res, next) {
  const rawUserId = req.headers["x-user-id"];

  if (!rawUserId) {
    return next(new UnauthorizedError("X-User-Id header is required"));
  }

  const userId = Number(rawUserId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return next(new UnauthorizedError("Invalid X-User-Id header"));
  }

  const user = await userRepository.findById(userId);
  if (!user) {
    return next(new NotFoundError("User not found"));
  }

  req.userId = userId;
  next();
}
