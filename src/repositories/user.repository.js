import { Op } from "sequelize";
import User from "../models/User";

const userRepository = {
  findById(id, options = {}) {
    return User.findByPk(id, options);
  },

  findByEmail(email, options = {}) {
    return User.findOne({ where: { email }, ...options });
  },

  async emailExists(email, excludeUserId = null) {
    const where = { email };
    if (excludeUserId) where.id = { [Op.ne]: excludeUserId };
    return (await User.count({ where })) > 0;
  },

  create(userData, options = {}) {
    return User.create(userData, options);
  },

  update(user, userData, options = {}) {
    return user.update(userData, options);
  },

  findByIds(ids, options = {}) {
    if (!ids.length) return [];
    return User.findAll({ where: { id: { [Op.in]: ids } }, ...options });
  },

  countByIds(ids, options = {}) {
    if (!ids.length) return 0;
    return User.count({ where: { id: { [Op.in]: ids } }, ...options });
  },

  delete(user, options = {}) {
    return user.destroy(options);
  },
};

export default userRepository;
