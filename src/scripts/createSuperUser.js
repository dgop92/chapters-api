import { disconnect } from "@db/db";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { UserModel } from "../apps/auth/models";

async function createSuperUser() {
  const argv = yargs(hideBin(process.argv)).argv;

  const userModel = new UserModel();

  const { username, password, email } = argv;

  const { error, value: cleanData } = userModel.schema.validate({
    username,
    password,
    email,
  });

  if (error) {
    console.log(error);
  } else {
    try {
      await userModel.create(cleanData);
      disconnect();
      console.log("Succesfully created user with the following data: ");
      console.log(cleanData);
    } catch (error) {
      console.log("An unexpected error ocurred");
      console.log(error);
    }
  }
}

createSuperUser();
