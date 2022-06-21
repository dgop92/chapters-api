import db from "@db/db";
import { CleanData } from "@db/types";
import { ProfileModel, UserModel } from "auth/models";
import { userSchemaPropertites } from "auth/schemas";
import { generate } from "generate-password";
import { getRole } from "../role/role.utilities";
import { getInsertQuery } from "@db/crudQueries";
import {
  IntegrityConstraintViolationError,
  NotFoundError,
  sql,
  TaggedTemplateLiteralInvocation,
} from "slonik";
import { ModelError, ResourceNotFoundError } from "@db/customErrors";

// Todo improve types in update of profile-user relationship
type Student = {
  pk: number;
  chapter_id: number;
  user_id: number;
  rolename: string;
  status: boolean;
  activities: number;
};

type StudentItem = {
  pk: number;
  name: number;
  status: boolean;
  activities: number;
  rolename: string;
};

interface ChapterQuery {
  user_id?: number;
  chapter_id?: number;
}

// TODO: avoid hardcode values
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
  registrationSchema: ProfileModel.createUpdateSchema.keys({
    username: userSchemaPropertites.username,
    email: userSchemaPropertites.email,
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
      await ProfileModel.update(profileData, user.pk);
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

  async getChapterStudent(user_id: number, chapter_id: number) {
    const baseQuery = sql`SELECT "student"."pk", "chapter_id", "user_id", "status", "activities", "role"."rolename" FROM "student"`;
    const joinQuery = sql`INNER JOIN "role" ON "role".pk = "role_id"`;
    const lookupQuery = sql`WHERE "user_id" = ${user_id} AND "chapter_id" = ${chapter_id};`;
    const query = sql`${baseQuery} ${joinQuery} ${lookupQuery}`;

    try {
      const res = await db.one(query);
      return res as Student;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ResourceNotFoundError(this.tableName);
      } else {
        throw error;
      }
    }
  },

  async getChapters({ user_id, chapter_id }: ChapterQuery) {
    const baseQuery = sql`SELECT "student"."pk", "chapter"."name", "status", "activities", "role"."rolename" FROM "student"`;

    const joinQuery1 = sql`INNER JOIN "role" ON "role".pk = "role_id"`;
    const joinQuery2 = sql`INNER JOIN "chapter" ON "chapter".pk = "chapter_id"`;

    const conditions = [];
    if (user_id) {
      conditions.push(sql`"user_id" = ${user_id}`);
    }
    if (chapter_id) {
      conditions.push(sql`"chapter_id" = ${chapter_id}`);
    }

    let query;
    if (conditions.length > 0) {
      const lookupQuery = sql`WHERE ${sql.join(conditions, sql` AND `)}`;
      query = sql`${baseQuery} ${joinQuery1} ${joinQuery2} ${lookupQuery}`;
    } else {
      query = sql`${baseQuery} ${joinQuery1} ${joinQuery2}`;
    }

    const res = await db.query(query);
    return res.rows as StudentItem[];
  },
};
