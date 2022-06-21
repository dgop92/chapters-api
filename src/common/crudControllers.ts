import { Request, Response } from "express";
import { CleanData, CrudModel } from "@db/types";
import { catchErrors } from "./middlewares";

export const createOne = <ModelType>(model: CrudModel<ModelType>) =>
  catchErrors(async (req: Request, res: Response) => {
    const cleanData = await model.createUpdateSchema.validateAsync(req.body);
    const modelData = await model.create(cleanData);

    return res.status(201).json(modelData);
  });

export const updateOne = <ModelType>(model: CrudModel<ModelType>) =>
  catchErrors(async (req: Request, res: Response) => {
    let cleanData: CleanData;
    if (req.method === "PUT") {
      cleanData = await model.createUpdateSchema.validateAsync(req.body);
    } else {
      cleanData = await model.partialUpdateSchema.validateAsync(req.body);
    }
    const modelData = await model.update(cleanData, Number(req.params.id));
    return res.status(200).json(modelData);
  });

export const getOne = <ModelType>(model: CrudModel<ModelType>) =>
  catchErrors(async (req: Request, res: Response) => {
    const modelData = await model.detail(Number(req.params.id));

    return res.status(200).json(modelData);
  });

export const deleteOne = <ModelType>(model: CrudModel<ModelType>) =>
  catchErrors(async (req: Request, res: Response) => {
    await model.delete(Number(req.params.id));
    return res.status(204).json({});
  });
