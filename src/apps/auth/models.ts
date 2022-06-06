import Joi from "joi";
import bcrypt from "bcrypt";
import { getInsertQuery } from "@db/crudQueries";
import db from "@db/db";
import { UniqueIntegrityConstraintViolationError } from "slonik";

type User = {
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

  modelErrors = {
    unique_username: "a user with this username already exists",
    unique_email: "a user with this email already exists",
  };

  // Expected to be created in a console
  async create(cleanData: User) {
    const hashedPassword = await bcrypt.hash(cleanData.password, 8);
    cleanData.password = hashedPassword;

    try {
      const query = getInsertQuery(cleanData, this.tableName);
      const res = await db.query(query);
      return res.rows[0];
    } catch (error) {
      if (error instanceof UniqueIntegrityConstraintViolationError) {
        const constraintName = error.constraint;
        if (Object.values(this.modelErrors).includes(constraintName)) {
          // @ts-ignore   temporal solution
          throw new Error(this.modelErrors[constraintName]);
        }
      }
      throw error;
    }
  }
}
