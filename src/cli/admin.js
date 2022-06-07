import { Command } from "commander";
import { createSuperUser } from "./commands/users";
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

program.parseAsync();
