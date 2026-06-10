import express from "express";
import bodyParser from "body-parser";
import globalErrorHandler from "../middlewares/errorHandler.middleware";
import { apiRouter } from "../routes";

const expressService = {
  init() {
    const app = express();
    app.use(bodyParser.json());
    app.use("/api/v1", apiRouter);
    app.use(globalErrorHandler);

    const port = process.env.SERVER_PORT || 3000;
    app.listen(port, () => console.log(`[app] listening on ${port}`));
  },
};

export default expressService;
