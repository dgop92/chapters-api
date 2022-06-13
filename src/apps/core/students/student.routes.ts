import { singleParamValidation } from "apps/common/middlewares";
import { Router } from "express";
import Joi from "joi";
import { registerStudent } from "./student.controller";

const router = Router();

const simpleDetailSchema = Joi.object({
  chapter_id: Joi.number().integer().positive().required(),
});

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
