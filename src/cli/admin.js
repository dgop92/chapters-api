import { Command } from "commander";
import {
  createSuperUser,
  createBasicRoles,
  createChapter,
  createExecutiveStudent,
} from "./commands";
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

program
  .command("create-chapter <name>")
  .option("-f, --faculty <string>")
  .option("-d, --departament <string>")
  .option("-c, --career <string>")
  .description("create a chapter")
  .action(async (name, optionalParameters) => {
    await createChapter({ name, ...optionalParameters });
  });

program
  .command("create-executive <username> <email> <chapter_id>")
  .description("create a executive student, without a profile")
  .action(async (username, email, chapter_id) => {
    await createExecutiveStudent({ username, email }, Number(chapter_id));
  });

program.parseAsync();
