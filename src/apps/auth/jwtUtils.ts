import config from "config";
import jwt from "jsonwebtoken";
import { ResponseUser } from "./models";

export const getJwtToken = (user: ResponseUser) => {
  return jwt.sign({ pk: user.pk }, config.jwtSecret, {
    expiresIn: config.jwtExp,
  });
};
