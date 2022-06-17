import { ModelError } from "@db/customErrors";
import { disconnect } from "@db/db";
import { userSchema } from "auth/schemas";
import { UniqueIntegrityConstraintViolationError } from "slonik";
import { UserModel, User, ProfileModel } from "../auth/models";
import { createRole } from "../resources/role/role.utilities";

export async function createSuperUser(user: User) {
  const { error, value: cleanData } = userSchema.validate(user);

  if (error) {
    console.log(error);
  } else {
    try {
      const userData = await UserModel.create(cleanData, true);
      const profileData = await ProfileModel.create(
        {
          first_name: "admin-first-name",
          last_name: "admin-last-name",
          career: "admin-career-name",
          student_code: "admin-code",
        },
        userData.pk
      );
      disconnect();
      console.log("Succesfully created user with the following data: ");
      console.log(userData);
      console.log(profileData);
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
