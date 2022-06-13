import { Command } from "commander";
import { createSuperUser, createBasicRoles } from "./commands";
const program = new Command();

program
  .command("createsuperuser <username> <email> <password>")
  .description(
    "create a super user with the following fields username email password"
  )
  .action(async (username, email, password) => {
    const user = { username, email, password };
    await createSuperUser(user);
  });

program
  .command("create-roles")
  .description(
    "create the necessary student roles for the application to work correctly"
  )
  .action(createBasicRoles);

program.parseAsync();
