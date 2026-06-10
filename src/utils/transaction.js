import sequelizeService from "../services/sequelize.service";

export async function withTransaction(callback) {
  const sequelize = sequelizeService.getInstance();
  return sequelize.transaction(callback);
}

export async function runInTransaction(existingTransaction, callback) {
  if (existingTransaction) return callback(existingTransaction);
  return withTransaction(callback);
}
