import config from "config";
import { expressjwt } from "express-jwt";
import { NextFunction, Response } from "express";
import { AuthPayload } from "./jwtUtils";
import { Request as JWTRequest } from "express-jwt";
import { AuthError } from "./customErrors";

export const protectedEndpoint = () =>
  expressjwt({ secret: config.jwtSecret, algorithms: ["HS256"] });

// isAdmin is the same of superuser
export function isAdmin(
  req: JWTRequest<AuthPayload>,
  res: Response,
  next: NextFunction
) {
  const { is_admin } = req.auth!;
  if (is_admin) {
    next();
  } else {
    next(new AuthError("You do not have permission to make this action", true));
  }
}
