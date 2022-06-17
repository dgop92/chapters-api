import Joi from "joi";
import db from "@db/db";
import { CleanData } from "@db/types";
import { ProfileModel, UserModel } from "auth/models";
import { profileSchemaProperties, userSchemaPropertites } from "auth/schemas";
import { generate } from "generate-password";
import { getRole } from "../role/role.utilities";
import { getInsertQuery } from "@db/crudQueries";
import {
  IntegrityConstraintViolationError,
  sql,
  TaggedTemplateLiteralInvocation,
} from "slonik";
import { ModelError } from "@db/customErrors";

// Todo improve types in update of profile-user relationship
type Student = {
  pk: number;
  chapter_id: number;
  user_id: number;
  role_name: string;
  status: boolean;
  activities: number;
};

const getStudentResponseQuery = (
  actionQuery: TaggedTemplateLiteralInvocation
) => {
  return sql`WITH inserted_student as (
    ${actionQuery}
  ) SELECT 
  inserted_student.pk, 
  inserted_student.chapter_id,
  inserted_student.user_id, 
  inserted_student.status,
  inserted_student.activities, 
  rolename
  FROM inserted_student INNER JOIN "role" ON "role"."pk" = inserted_student.role_id;`;
};

export const StudentModel = {
  tableName: "student",
  registrationSchema: Joi.object({
    username: userSchemaPropertites.username,
    email: userSchemaPropertites.email,
    ...profileSchemaProperties,
  }),
  integrityErrors: {
    unique_chapter_user: "an user cannot appear twice in a chapter",
    fg_chapter: "the chapter provided does not exit",
    fg_user: "the user provided does not exit",
  },
  // cleanData contains user_id
  async create(
    cleanData: CleanData,
    chapter_id: number,
    rolename: string = "member"
  ) {
    const { username, email, ...profileData } = cleanData;
    const password = generate({
      length: 15,
      numbers: true,
    });

    const { created, user } = await UserModel.getOrCreate({
      username,
      password,
      email,
    });

    if (created) {
      await ProfileModel.create(profileData, user.pk);
    }
    const role = await getRole(rolename);

    const insertCleanData: CleanData = {
      chapter_id,
      user_id: user.pk,
      role_id: role.pk,
    };

    const insertQuery = getInsertQuery(insertCleanData, "student");
    const query = getStudentResponseQuery(insertQuery);

    try {
      const res = await db.one(query);
      return res as Student;
    } catch (error) {
      if (error instanceof IntegrityConstraintViolationError) {
        throw new ModelError(this.integrityErrors, error);
      }
      throw error;
    }
  },
};
