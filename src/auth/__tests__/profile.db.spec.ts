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

    await expect(
      checkResourceExists("profile", { field: "user_id", value: user.pk })
    ).to.eventually.equal(true);
  });
  it("should retrieve a user's profile", async () => {
    const user = await UserModel.create(userData1);
    const profile = await ProfileModel.update(profileData1, user.pk);

    const profileRetrieved = await ProfileModel.getAuthenticatedProfile(
      user.pk
    );

    expect(profile.user_id).to.be.equal(profileRetrieved.user_id);
  });

  it("should update user's profile", async () => {
    const user = await UserModel.create(userData1);
    const profileUpdated = await ProfileModel.update(profileData1, user.pk);
    const { pk, user_id, ...realData } = profileUpdated;

    expect(realData).to.be.eql(profileData1);
  });
});
