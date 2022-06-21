import { protectedEndpoint } from "auth/middlewares";
import {
  queryParamValidation,
  singleParamValidation,
} from "common/middlewares";
import { Router } from "express";
import Joi from "joi";
import { getMany, registerStudent, userStudents } from "./student.controller";

const getManyQuerySchema = Joi.object({
  user_id: Joi.number().integer().positive(),
  chapter_id: Joi.number().integer().positive(),
});

const router = Router();

const simpleDetailSchema = Joi.object({
  chapter_id: Joi.number().integer().positive().required(),
});

router
  .route("/")
  .get([
    protectedEndpoint(),
    queryParamValidation(getManyQuerySchema),
    getMany,
  ]);

router.route("/own").get([protectedEndpoint(), userStudents]);

// may in the future add reset password, change password
router
  .route("/register/:chapter_id")
  .post(
    singleParamValidation(
      simpleDetailSchema,
      "chapter_id must be a positive integer"
    ),
    registerStudent
  );

export default router;
