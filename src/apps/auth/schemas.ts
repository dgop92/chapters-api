import Joi from "joi";

export const loginSchema = Joi.object({
  username: Joi.string().min(3).max(45).required(),
  password: Joi.string().min(10).max(30).required(),
});

export const userSchema = loginSchema.keys({
  email: Joi.string().email().required(),
});

const registrationSchema = userSchema.keys({
  repeat_password: Joi.ref("password"),
});
