import Joi from "joi";
import { NextFunction, Request, Response } from "express";

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
