import Joi from "joi";
import { NextFunction, Request, Response, RequestHandler } from "express";
import { ValidationError } from "joi";
import { ModelError, ResourceNotFoundError } from "@db/customErrors";
import { AuthPayload } from "../auth/jwtUtils";
import { Request as JWTRequest } from "express-jwt";
import { AuthError } from "../auth/customErrors";
import { StudentModel } from "resources/students/student.model";

const simpleDetailSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export const validateLookUpField = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = simpleDetailSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ detail: "id must be a positive integer" });
  }
  return next();
};

export const singleParamValidation =
  (paramSchema: Joi.ObjectSchema, errorMessage: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { error } = paramSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ detail: errorMessage });
    }
    return next();
  };

// Copy from https://github.com/oldboyxx/jira_clone/blob/26a9e77b1789fef9cb43edb5d6018cf1663cf035/api/src/errors/asyncCatch.ts#L3
export const catchErrors = (requestHandler: RequestHandler): RequestHandler => {
  return async (req, res, next): Promise<any> => {
    try {
      return await requestHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export function handleCommonErrors(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      errorType: "schema-error",
      errorData: err.details[0],
    });
  }
  if (err instanceof ModelError) {
    return res.status(400).json(err.details);
  }
  if (err instanceof ResourceNotFoundError) {
    return res.status(404).json(err.details);
  }
  return res.status(500).json({ message: "Internal Server Error" });
}

export async function isAdminOrChapterExecutive(
  req: JWTRequest<AuthPayload>,
  res: Response,
  next: NextFunction
) {
  const { pk: user_id, is_admin } = req.auth!;
  const chapter_id = Number(req.params.id);
  if (is_admin) {
    next();
  } else {
    const authError = new AuthError(
      "You do not have permission to make this action",
      true
    );

    try {
      const student = await StudentModel.getChapterStudent(user_id, chapter_id);
      if (student.rolename === "executive") {
        next();
      } else {
        next(authError);
      }
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        next(authError);
      } else {
        throw error;
      }
    }
  }
}
