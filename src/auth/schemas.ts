import { CleanData } from "@db/types";
import Joi from "joi";

export const userSchemaPropertites = {
  username: Joi.string().min(3).max(45).required(),
  password: Joi.string().min(10).max(30).required(),
  email: Joi.string().email().required(),
};

export const loginSchema = Joi.object<CleanData>({
  username: userSchemaPropertites.username,
  password: userSchemaPropertites.password,
});

export const userSchema = loginSchema.keys(userSchemaPropertites);

export const profileSchemaProperties = {
  first_name: Joi.string().max(150),
  last_name: Joi.string().max(150),
  career: Joi.string().max(90),
  student_code: Joi.string().max(14),
};
