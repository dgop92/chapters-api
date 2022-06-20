import { catchErrors } from "common/middlewares";
import { Request, Response } from "express";
import { StudentModel } from "./student.model";

export const registerStudent = catchErrors(
  async (req: Request, res: Response) => {
    const cleanData = await StudentModel.registrationSchema.validateAsync(
      req.body
    );
    const student = await StudentModel.create(
      cleanData,
      Number(req.params.chapter_id)
    );
    return res.status(200).json(student);
  }
);
