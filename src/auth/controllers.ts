import { Request, Response } from "express";
import { loginSchema } from "./schemas";
import { ProfileModel, UserModel } from "./models";
import { AuthError } from "./customErrors";
import { getJwtToken } from "./jwtUtils";
import { Request as JWTRequest } from "express-jwt";
import { ValidationError } from "joi";
import { ResourceNotFoundError } from "@db/customErrors";

const userModel = new UserModel();
const profileModel = new ProfileModel();

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

export const myProfile = async (req: JWTRequest, res: Response) => {
  const pk: number = req.auth?.pk;

  try {
    const profile = await profileModel.getAuthenticatedProfile(pk);

    return res.status(200).json(profile);
  } catch (err) {
    // For admin users only
    if (err instanceof ResourceNotFoundError) {
      return res.status(404).json(err.details);
    }
  }
};

// Called from PUT or PATCH
export const updateProfile = async (req: JWTRequest, res: Response) => {
  const pk: number = req.auth?.pk;

  try {
    let cleanData;
    if (req.method === "PUT") {
      cleanData = await profileModel.createUpdateSchema.validateAsync(
        req.body,
        {
          abortEarly: false,
        }
      );
    } else {
      cleanData = await profileModel.partialUpdateSchema.validateAsync(
        req.body,
        {
          abortEarly: false,
        }
      );
    }
    const profile = await profileModel.update(cleanData, pk);

    return res.status(200).json(profile);
  } catch (err) {
    // For admin users only
    if (
      err instanceof ValidationError ||
      err instanceof ResourceNotFoundError
    ) {
      return res.status(404).json(err.details);
    }
    throw err;
  }
};
