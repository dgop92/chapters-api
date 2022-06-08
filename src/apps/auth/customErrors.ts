import { NextFunction, Request, Response } from "express";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
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
      "Authentication credentials were not provided"
    );
    res.status(401).send(authError.details);
  } else {
    next(err);
  }
}
