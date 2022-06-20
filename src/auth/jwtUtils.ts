import config from "config";
import jwt from "jsonwebtoken";
import { User } from "./models";

export interface AuthPayload extends jwt.JwtPayload {
  pk: number;
  username: string;
  email: string;
  is_admin: boolean;
}

export const getJwtToken = (user: User) => {
  return jwt.sign(
    {
      pk: user.pk,
      is_admin: user.is_admin,
      username: user.username,
      email: user.email,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExp,
    }
  );
};
