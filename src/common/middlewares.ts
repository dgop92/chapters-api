import Joi from "joi";
import { NextFunction, Request, Response, RequestHandler } from "express";
import { ValidationError } from "joi";
import { ModelError, ResourceNotFoundError } from "@db/customErrors";

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
