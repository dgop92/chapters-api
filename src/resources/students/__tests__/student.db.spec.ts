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
  it("should create a student", async () => {
    await createRole("member");
    const chapter = await ChapterModel.create(chapterData);
    const chapter_id = chapter.pk;

    const student = await StudentModel.create(
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
  it("should be a valid registration schema", async () => {
    const { error } = StudentModel.registrationSchema.validate({
      ...userData,
      ...profileData,
    });
    expect(error).to.be.equal(undefined);
  });
  it("should throw an error for no profile in registration schema", async () => {
    const { error } = StudentModel.registrationSchema.validate({
      ...userData,
    });
    expect(error).to.not.be.equal(undefined);
  });
  it("should throw an error for invalid user data in registration schema", async () => {
    const { error } = StudentModel.registrationSchema.validate({
      username: "j",
      email: "j",
      ...profileData,
    });
    expect(error).to.not.be.equal(undefined);
  });
  it("should retrieve the chapter student", async () => {
    await createRole("member");
    const chapter = await ChapterModel.create(chapterData);
    const chapter_id = chapter.pk;

    const student = await StudentModel.create(
      { ...userData, ...profileData },
      chapter_id
    );
    const retrievedStudent = await StudentModel.getChapterStudent(
      student.user_id,
      chapter_id
    );
    expect(student).to.be.eql(retrievedStudent);
  });
});
