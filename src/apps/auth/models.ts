import bcrypt from "bcrypt";
import { getDetailQuery, getInsertQuery } from "@db/crudQueries";
import db from "@db/db";
import { IntegrityConstraintViolationError, NotFoundError, sql } from "slonik";
import { ModelError } from "@db/customErrors";
import { AuthError } from "./customErrors";

export type User = {
  username: string;
  email: string;
  password: string;
};

export type ResponseUser = User & {
  pk: number;
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
      return res.rows[0] as ResponseUser;
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
      )) as ResponseUser;
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
    return res as ResponseUser;
  }
}
