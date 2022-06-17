import { expect } from "chai";
import { ProfileModel, UserModel } from "../models";
import { checkResourceExists } from "@db/genericOperations";

const profileData1 = {
  first_name: "pedroski_root2",
  last_name: "KageHak",
  student_code: "32222226",
  career: "Filosofia",
};
const userData1 = {
  username: "real_username",
  email: "example@gmail.com",
  password: "securePassword1234",
};

describe("#ProfileModel", () => {
  it("should create a profile", async () => {
    const user = await UserModel.create(userData1);
    const profile = await ProfileModel.create(profileData1, user.pk);

    console.log(profile);

    await expect(
      checkResourceExists("profile", { field: "pk", value: profile.pk })
    ).to.eventually.equal(true);
  });
  it("should retrieve a user's profile", async () => {
    const user = await UserModel.create(userData1);
    const profile = await ProfileModel.create(profileData1, user.pk);

    const profileRetrieved = await ProfileModel.getAuthenticatedProfile(
      user.pk
    );

    console.log(profile);
    expect(profile.user_id).to.be.equal(profileRetrieved.user_id);
  });

  it("should update user's profile", async () => {
    const user = await UserModel.create(userData1);
    await ProfileModel.create(profileData1, user.pk);

    const profileUpdated = await ProfileModel.update(
      { first_name: "juanitoski" },
      user.pk
    );
    expect(profileUpdated.first_name).to.be.equal("juanitoski");
  });
});
