import { NextFunction, Request, Response } from "express";

export class AuthError extends Error {
  isPermissionError: boolean;

  constructor(message: string, isPermError = false) {
    super(message);
    this.isPermissionError = isPermError;
  }

  get details() {
    return {
      errorType: "auth",
      errorData: {
        message: this.message,
      },
    };
  }
}

export function handleUnauthorizedError(
  err: { name: string },
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === "UnauthorizedError") {
    const authError = new AuthError(
      "Authentication credentials are invalid or missing"
    );
    return res.status(401).send(authError.details);
  }
  if (err instanceof AuthError) {
    const statusCode = err.isPermissionError ? 403 : 401;
    return res.status(statusCode).send(err.details);
  }
  next(err);
}
