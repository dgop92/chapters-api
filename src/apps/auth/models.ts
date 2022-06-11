import bcrypt from "bcrypt";
import {
  getDetailQuery,
  getInsertQuery,
  getUpdateQuery,
} from "@db/crudQueries";
import db from "@db/db";
import { IntegrityConstraintViolationError, NotFoundError, sql } from "slonik";
import { ModelError } from "@db/customErrors";
import { AuthError } from "./customErrors";
import { CleanData } from "@db/types";
import { checkResourceExists } from "@db/genericOperations";
import Joi from "joi";

export type User = {
  pk: number;
  username: string;
  email: string;
  password: string;
  is_admin: boolean;
};

const LOGIN_ERROR = "Could not login with the provided credentials";

export class UserModel {
  tableName = "user";

  integrityErrors = {
    unique_username: "a user with this username already exists",
    unique_email: "a user with this email already exists",
  };

  // Expected to be created in a console
  async create(cleanData: CleanData, isAdmin = false) {
    const hashedPassword = await bcrypt.hash(cleanData.password, 8);

    const newData = {
      ...cleanData,
      password: hashedPassword,
      is_admin: isAdmin,
    };

    try {
      const query = getInsertQuery(newData, this.tableName);
      const res = await db.query(query);
      return res.rows[0] as User;
    } catch (error) {
      if (error instanceof IntegrityConstraintViolationError) {
        throw new ModelError(this.integrityErrors, error);
      }
      throw error;
    }
  }

  async login(username: string, password: string) {
    const lookupQuery = sql`WHERE username=${username}`;

    try {
      const user = (await db.one(
        sql`SELECT * FROM "user" ${lookupQuery}`
      )) as User;
      const arePasswordEqual = await bcrypt.compare(password, user.password);

      if (!arePasswordEqual) {
        throw new AuthError(LOGIN_ERROR);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundError) {
        // generic error, in order to not reveal what username already exists in db
        throw new AuthError(LOGIN_ERROR);
      }
      throw error;
    }
  }

  async getAuthenticatedUser(pk: number) {
    const query = getDetailQuery(this.tableName, { field: "pk", value: pk });
    const res = await db.one(query);
    return res as User;
  }
}

type Profile = {
  pk: number;
  first_name: string;
  last_name: string;
  student_code: string;
  career: string;
  user_id: number;
};

const profilePartialUpdateSchema = Joi.object<CleanData>({
  first_name: Joi.string().max(150),
  last_name: Joi.string().max(150),
  career: Joi.string().max(90),
  student_code: Joi.string().max(14),
});

export class ProfileModel {
  tableName = "profile";

  partialUpdateSchema = profilePartialUpdateSchema;
  createUpdateSchema = profilePartialUpdateSchema
    .options({ presence: "required" })
    .required();

  // cleanData contains user_id
  async create(cleanData: CleanData, user_id: number) {
    const query = getInsertQuery({ ...cleanData, user_id }, this.tableName);
    const res = await db.one(query);
    return res as Profile;
  }

  async getAuthenticatedProfile(user_id: number) {
    await checkResourceExists(this.tableName, {
      field: "user_id",
      value: user_id,
    });

    const query = getDetailQuery(this.tableName, {
      field: "user_id",
      value: user_id,
    });
    const res = await db.one(query);
    return res as Profile;
  }

  async update(cleanData: CleanData, user_id: number) {
    await checkResourceExists(this.tableName, {
      field: "user_id",
      value: user_id,
    });

    const query = getUpdateQuery(cleanData, this.tableName, {
      field: "user_id",
      value: user_id,
    });
    const res = await db.one(query);
    return res as Profile;
  }
}
