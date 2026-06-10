import { isApiError } from "../utils/ApiError";

export default (err, _req, res, next) => {
  if (res.headersSent) return next(err);

  if (isApiError(err)) {
    return res.status(err.statusCode).json({
      error: { code: err.type, message: err.message },
    });
  }

  if (err.name === "SequelizeValidationError") {
    const message = err.errors?.[0]?.message || "Validation error";
    return res.status(400).json({
      error: { code: "VALIDATION", message },
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  return res.status(500).json({
    error: { code: "SERVER_ERROR", message: "Something went wrong" },
  });
};
