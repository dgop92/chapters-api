import { Request, Response } from "express";
import { loginSchema } from "./schemas";
import { ProfileModel, UserModel } from "./models";
import { getJwtToken, AuthPayload } from "./jwtUtils";
import { Request as JWTRequest } from "express-jwt";
import { catchErrors } from "common/middlewares";

export const signin = catchErrors(async (req: Request, res: Response) => {
  const cleanData = await loginSchema.validateAsync(req.body);
  const user = await UserModel.login(cleanData.username, cleanData.password);
  const token = getJwtToken(user);
  return res.status(200).json({ access: token });
});

export const me = catchErrors(
  async (req: JWTRequest<AuthPayload>, res: Response) => {
    const { pk, is_admin, username, email } = req.auth!;
    return res.status(200).json({ pk, is_admin, username, email });
  }
);

export const myProfile = catchErrors(
  async (req: JWTRequest<AuthPayload>, res: Response) => {
    const { pk } = req.auth!;

    const profile = await ProfileModel.getAuthenticatedProfile(pk);
    return res.status(200).json(profile);
  }
);

// Called from PUT or PATCH
export const updateProfile = catchErrors(
  async (req: JWTRequest<AuthPayload>, res: Response) => {
    const { pk } = req.auth!;

    let cleanData;
    if (req.method === "PUT") {
      cleanData = await ProfileModel.createUpdateSchema.validateAsync(req.body);
    } else {
      cleanData = await ProfileModel.partialUpdateSchema.validateAsync(
        req.body
      );
    }
    const profile = await ProfileModel.update(cleanData, pk);

    return res.status(200).json(profile);
  }
);
