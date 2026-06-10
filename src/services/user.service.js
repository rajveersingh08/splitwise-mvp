import { DEFAULT_CURRENCY } from "../constants/currencies";
import userRepository from "../repositories/user.repository";
import { ConflictError, NotFoundError, UnauthorizedError } from "../utils/ApiError";
import { normalizeCurrencyCode } from "../utils/currency";
import { toPublicUser } from "../utils/user.mapper";

const userService = {
  async register({ email, password, defaultCurrency = DEFAULT_CURRENCY }) {
    const normalizedEmail = email.trim().toLowerCase();

    if (await userRepository.emailExists(normalizedEmail)) {
      throw new ConflictError("Email is already registered");
    }

    const user = await userRepository.create({
      email: normalizedEmail,
      password,
      default_currency: normalizeCurrencyCode(defaultCurrency),
    });

    return toPublicUser(user);
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email.trim().toLowerCase());

    if (!user || !(await user.checkPassword(password))) {
      throw new UnauthorizedError("Invalid credentials");
    }

    return toPublicUser(user);
  },

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    return toPublicUser(user);
  },

  async updateProfile(userId, { email, defaultCurrency }) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const updates = {};

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      if (await userRepository.emailExists(normalizedEmail, userId)) {
        throw new ConflictError("Email is already registered");
      }
      updates.email = normalizedEmail;
    }

    if (defaultCurrency) {
      updates.default_currency = normalizeCurrencyCode(defaultCurrency);
    }

    const updatedUser = await userRepository.update(user, updates);
    return toPublicUser(updatedUser);
  },

  async deleteAccount(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    await userRepository.delete(user);
  },
};

export default userService;
