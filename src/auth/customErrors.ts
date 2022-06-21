import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "express-jwt";

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
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof UnauthorizedError) {
    const authError = new AuthError(err.message);
    return res.status(401).send(authError.details);
  }
  if (err instanceof AuthError) {
    const statusCode = err.isPermissionError ? 403 : 401;
    return res.status(statusCode).send(err.details);
  }
  next(err);
}
