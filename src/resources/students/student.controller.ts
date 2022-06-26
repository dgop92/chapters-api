import { catchErrors } from "common/middlewares";
import { Request, Response } from "express";
import { StudentModel } from "./student.model";
import { AuthPayload } from "auth/jwtUtils";
import { Request as JWTRequest } from "express-jwt";

export const registerStudent = catchErrors(
  async (req: Request, res: Response) => {
    const cleanData = await StudentModel.registrationSchema.validateAsync(
      req.body
    );
    const student = await StudentModel.create(
      cleanData,
      Number(req.params.chapter_id)
    );
    return res.status(201).json(student);
  }
);

export const getMany = catchErrors(async (req: Request, res: Response) => {
  const results = await StudentModel.getChapters(req.query);
  return res.status(200).json(results);
});

export const userStudents = catchErrors(
  async (req: JWTRequest<AuthPayload>, res: Response) => {
    const results = await StudentModel.getChapters({ user_id: req.auth?.pk });
    return res.status(200).json(results);
  }
);

export const activitiesBatchUpdate = catchErrors(
  async (req: Request, res: Response) => {
    const chapter_id = Number(req.params.id);
    const { usernames } = await StudentModel.updateActivitySchema.validateAsync(
      req.body
    );
    console.log(chapter_id, usernames);
    const result = await StudentModel.updateActivity(usernames, chapter_id);

    return res.status(200).json({ studentsUpdated: result.rowCount });
  }
);
