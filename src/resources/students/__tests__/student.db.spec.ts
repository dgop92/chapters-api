import { expect } from "chai";
import { StudentModel } from "../student.model";
import { checkResourceExists } from "@db/genericOperations";
import { ChapterModel } from "resources/chapters/chapter.model";
import { createRole } from "resources/role/role.utilities";

const chapterData = {
  name: "ACM",
  faculty: "Ingenierias",
  departament: "Dpto. Ingeniería de Sistemas y Computación",
  career: "Ingeniería de Sistemas",
};

const profileData = {
  first_name: "pedroski_root2",
  last_name: "KageHak",
  student_code: "32222226",
  career: "Filosofia",
};

const userData = {
  username: "real_username",
  email: "example@gmail.com",
};

describe("#StudentModel", () => {
  let studentModel: StudentModel;
  let chapterModel: ChapterModel;

  before("set up", async function () {
    studentModel = new StudentModel();
    chapterModel = new ChapterModel();
  });

  it("should create a student", async () => {
    await createRole("member");
    const chapter = await chapterModel.create(chapterData);
    const chapter_id = chapter.pk;

    const student = await studentModel.create(
      { ...userData, ...profileData },
      chapter_id
    );

    console.log(student);

    await expect(
      checkResourceExists("student", { field: "pk", value: student.pk })
    ).to.eventually.equal(true);
    await expect(
      checkResourceExists("user", { field: "pk", value: student.user_id })
    ).to.eventually.equal(true);
  });
});
