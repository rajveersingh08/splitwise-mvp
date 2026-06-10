import { ValidationError } from "../utils/ApiError";

export default function validate(schema, source = "body") {
  return async (req, _res, next) => {
    try {
      const validated = await schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
      });

      req[source] = validated;
      return next();
    } catch (error) {
      if (error.name === "ValidationError") {
        return next(new ValidationError(error.errors.join(", ")));
      }

      return next(error);
    }
  };
}
