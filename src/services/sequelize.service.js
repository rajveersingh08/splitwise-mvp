import { Sequelize } from "sequelize";
import databaseConfig from "../config/database";
import fs from "fs";
import path from "path";

const modelsDir = path.join(__dirname, "../models");
const modelFiles = fs.readdirSync(modelsDir).filter((f) => f.endsWith(".js"));

let sequelize = null;

const sequelizeService = {
  getInstance() {
    if (!sequelize) throw new Error("Database not initialized");
    return sequelize;
  },

  async init() {
    sequelize = new Sequelize(databaseConfig);

    for (const file of modelFiles) {
      const model = await import(`../models/${file}`);
      model.default.init(sequelize);
    }

    for (const file of modelFiles) {
      const model = await import(`../models/${file}`);
      if (model.default.associate) {
        model.default.associate(sequelize.models);
      }
    }

    await sequelize.authenticate();
    console.log("[db] connected");
  },
};

export default sequelizeService;
