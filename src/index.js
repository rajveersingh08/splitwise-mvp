import dotenv from "dotenv";
import expressService from "./services/express.service";
import sequelizeService from "./services/sequelize.service";

dotenv.config();

(async () => {
  try {
    await sequelizeService.init();
    expressService.init();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
