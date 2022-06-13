import { ValidationError } from "joi";
import { ModelError } from "@db/customErrors";
import { Request, Response } from "express";
import { StudentModel } from "./student.model";

const studentModel = new StudentModel();

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const cleanData = await studentModel.registrationSchema.validateAsync(
      req.body,
      {
        abortEarly: false,
      }
    );
    const student = await studentModel.create(
      cleanData,
      Number(req.params.chapter_id)
    );
    return res.status(200).json(student);
  } catch (error) {
    if (error instanceof ModelError || error instanceof ValidationError) {
      return res.status(400).json(error.details);
    } else {
      throw error;
    }
  }
};
