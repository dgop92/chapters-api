import config from "config";
import { expressjwt } from "express-jwt";

export const protectedEndpoint = () =>
  expressjwt({ secret: config.jwtSecret, algorithms: ["HS256"] });
