import { ModelError } from "@db/customErrors";
import { disconnect } from "@db/db";
import { UserModel, User } from "../../apps/auth/models";

export async function createSuperUser(user: User) {
  const userModel = new UserModel();

  const { error, value: cleanData } = userModel.schema.validate(user);

  if (error) {
    console.log(error);
  } else {
    try {
      const userData = await userModel.create(cleanData, true);
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
