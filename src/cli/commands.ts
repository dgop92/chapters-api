import { ModelError } from "@db/customErrors";
import { disconnect } from "@db/db";
import { CleanData } from "@db/types";
import { userSchema } from "auth/schemas";
import { ChapterModel } from "resources/chapters/chapter.model";
import { StudentModel } from "resources/students/student.model";
import { UniqueIntegrityConstraintViolationError } from "slonik";
import { UserModel } from "../auth/models";
import { createRole } from "../resources/role/role.utilities";

export async function createSuperUser(user: CleanData) {
  const { error, value: cleanData } = userSchema.validate(user);

  if (error) {
    console.log(error);
  } else {
    try {
      const userData = await UserModel.create(cleanData, true);
      disconnect();
      console.log("Succesfully created user with the following data: ");
      console.log(userData);
    } catch (error) {
      if (error instanceof ModelError) {
        console.log(error.details);
      } else {
        console.log("An unexpected error ocurred");
        console.log(error);
      }
    }
  }
}

async function createRoleUtil(rolename: string) {
  try {
    const role = await createRole(rolename);
    console.log(role);
  } catch (error) {
    if (error instanceof UniqueIntegrityConstraintViolationError) {
      console.log(`This role '${rolename}' has already been created`);
    }
  }
}

export async function createBasicRoles() {
  await createRoleUtil("member");
  await createRoleUtil("executive");
  console.log("Roles created successfully");
  disconnect();
}

export async function createChapter(chapterData: CleanData) {
  try {
    const cleanData = await ChapterModel.createUpdateSchema.validateAsync(
      chapterData
    );
    const chapter = await ChapterModel.create(cleanData);
    console.log(chapter);
    disconnect();
  } catch (error) {
    console.log(error);
  }
}

export async function createExecutiveStudent(
  studentData: CleanData,
  chapter_id: number
) {
  try {
    const exetendedCleanData = {
      ...studentData,
      first_name: "template_first_name",
      last_name: "template_last_name",
      student_code: "your_code",
      career: "student_career",
    };
    const cleanData = await StudentModel.registrationSchema.validateAsync(
      exetendedCleanData
    );
    const student = await StudentModel.create(
      cleanData,
      chapter_id,
      "executive"
    );
    console.log(student);
    disconnect();
  } catch (error) {
    console.log(error);
  }
}
