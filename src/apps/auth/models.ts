import Joi from "joi";
import bcrypt from "bcrypt";
import { getInsertQuery } from "@db/crudQueries";
import db from "@db/db";
import { IntegrityConstraintViolationError } from "slonik";
import { ModelError } from "@db/customErrors";

export type User = {
  username: string;
  email: string;
  password: string;
};

export class UserModel {
  tableName = "user";

  schema = Joi.object({
    username: Joi.string().min(3).max(45).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(10).max(30).required(),
  });

  integrityErrors = {
    unique_username: "a user with this username already exists",
    unique_email: "a user with this email already exists",
  };

  // Expected to be created in a console
  async create(cleanData: User, isAdmin = false) {
    const hashedPassword = await bcrypt.hash(cleanData.password, 8);

    const newData = {
      ...cleanData,
      password: hashedPassword,
      is_admin: isAdmin,
    };

    try {
      const query = getInsertQuery(newData, this.tableName);
      const res = await db.query(query);
      return res.rows[0];
    } catch (error) {
      if (error instanceof IntegrityConstraintViolationError) {
        throw new ModelError(this.integrityErrors, error);
      }
      throw error;
    }
  }
}
