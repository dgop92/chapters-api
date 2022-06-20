import { Request, Response } from "express";
import { loginSchema } from "./schemas";
import { ProfileModel, UserModel } from "./models";
import { AuthError } from "./customErrors";
import { getJwtToken, AuthPayload } from "./jwtUtils";
import { Request as JWTRequest } from "express-jwt";
import { ValidationError } from "joi";
import { ResourceNotFoundError } from "@db/customErrors";

export const signin = async (req: Request, res: Response) => {
  try {
    const cleanData = await loginSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    const user = await UserModel.login(cleanData.username, cleanData.password);
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

export const me = async (req: JWTRequest<AuthPayload>, res: Response) => {
  const { pk, is_admin, username, email } = req.auth!;
  return res.status(200).json({ pk, is_admin, username, email });
};

export const myProfile = async (
  req: JWTRequest<AuthPayload>,
  res: Response
) => {
  const { pk } = req.auth!;

  const profile = await ProfileModel.getAuthenticatedProfile(pk);
  return res.status(200).json(profile);
};

// Called from PUT or PATCH
export const updateProfile = async (
  req: JWTRequest<AuthPayload>,
  res: Response
) => {
  const { pk } = req.auth!;

  try {
    let cleanData;
    if (req.method === "PUT") {
      cleanData = await ProfileModel.createUpdateSchema.validateAsync(
        req.body,
        {
          abortEarly: false,
        }
      );
    } else {
      cleanData = await ProfileModel.partialUpdateSchema.validateAsync(
        req.body,
        {
          abortEarly: false,
        }
      );
    }
    const profile = await ProfileModel.update(cleanData, pk);

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
