import { Request, Response } from "express";
import { loginSchema } from "./schemas";
import { UserModel } from "./models";
import { AuthError } from "./customErrors";
import { getJwtToken } from "./jwtUtils";
import { Request as JWTRequest } from "express-jwt";
import { ValidationError } from "joi";

const userModel = new UserModel();

export const signin = async (req: Request, res: Response) => {
  try {
    const cleanData = await loginSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    const user = await userModel.login(cleanData.username, cleanData.password);
    const token = getJwtToken(user);
    return res.status(200).json({ access: token });
  } catch (error) {
    if (error instanceof AuthError || error instanceof ValidationError) {
      return res.status(400).json(error.details);
    } else {
      throw error;
    }
  }
};

export const me = async (req: JWTRequest, res: Response) => {
  const pk: number = req.auth?.pk;
  const user = await userModel.getAuthenticatedUser(pk);
  const { password, ...cleanUser } = user;
  return res.status(200).json(cleanUser);
};
