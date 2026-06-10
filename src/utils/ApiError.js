class ApiError extends Error {
  constructor(message, statusCode, type) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
  }
}

export const isApiError = (err) => err instanceof ApiError;

export class NotFoundError extends ApiError {
  constructor(message = "Not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Validation error") {
    super(message, 400, "VALIDATION");
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Resource conflict") {
    super(message, 409, "CONFLICT");
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Invalid credentials") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Permission denied") {
    super(message, 403, "FORBIDDEN");
  }
}
