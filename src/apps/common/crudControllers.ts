import { Request, Response } from "express";
import { ValidationError } from "joi";
import { CrudModel } from "@db/types";
import { ModelError, ResourceNotFoundError } from "@db/customErrors";

export const createOne =
  <ModelType>(model: CrudModel<ModelType>) =>
  async (req: Request, res: Response) => {
    try {
      const cleanData = await model.createUpdateSchema.validateAsync(req.body, {
        abortEarly: false,
      });
      const modelData = await model.create(cleanData);

      return res.status(201).json(modelData);
    } catch (err) {
      if (err instanceof ValidationError || err instanceof ModelError) {
        return res.status(400).json(err.details);
      }
    }
  };

export const updateOne =
  <ModelType>(model: CrudModel<ModelType>) =>
  async (req: Request, res: Response) => {
    try {
      const cleanData = await model.createUpdateSchema.validateAsync(req.body, {
        abortEarly: false,
      });
      const modelData = await model.update(cleanData, Number(req.params.id));
      return res.status(200).json(modelData);
    } catch (err) {
      if (err instanceof ValidationError || err instanceof ModelError) {
        return res.status(400).json(err.details);
      }
      if (err instanceof ResourceNotFoundError) {
        return res.status(404).json(err.details);
      }
    }
  };

export const getOne =
  <ModelType>(model: CrudModel<ModelType>) =>
  async (req: Request, res: Response) => {
    try {
      const modelData = await model.detail(Number(req.params.id));

      return res.status(200).json(modelData);
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return res.status(404).json(err.details);
      }
    }
  };

export const deleteOne =
  <ModelType>(model: CrudModel<ModelType>) =>
  async (req: Request, res: Response) => {
    try {
      await model.delete(Number(req.params.id));

      return res.status(204).json({});
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return res.status(404).json(err.details);
      }
    }
  };
