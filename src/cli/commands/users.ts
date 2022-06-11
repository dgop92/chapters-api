import { ModelError } from "@db/customErrors";
import { disconnect } from "@db/db";
import { userSchema } from "apps/auth/schemas";
import { UserModel, User, ProfileModel } from "../../apps/auth/models";

export async function createSuperUser(user: User) {
  const userModel = new UserModel();
  const profileModel = new ProfileModel();

  const { error, value: cleanData } = userSchema.validate(user);

  if (error) {
    console.log(error);
  } else {
    try {
      const userData = await userModel.create(cleanData, true);
      const profileData = await profileModel.create(
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
