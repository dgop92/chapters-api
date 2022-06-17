import { expect } from "chai";
import { UserModel } from "../models";
import db from "@db/db";
import { getExitsQuery, getSimpleLookupQuery } from "@db/genericQueries";
import { ModelError } from "@db/customErrors";

const userData1 = {
  username: "real_username",
  email: "example@gmail.com",
  password: "securePassword1234",
};
const userData2 = {
  username: "real_username2",
  email: "example@gmail.com",
  password: "securePassword1234",
};

describe("#UserModel", () => {
  it("should create a user", async () => {
    const user = await UserModel.create(userData1);
    const userExits = await db.exists(
      getExitsQuery(
        UserModel.tableName,
        getSimpleLookupQuery({ field: "pk", value: user.pk })
      )
    );
    expect(userExits).to.be.equal(true);
    expect(user.username).to.be.equal(userData1.username);
    expect(user.email).to.be.equal(userData1.email);
  });
  it("should raise unique username", async () => {
    await UserModel.create(userData1);
    await expect(UserModel.create(userData1)).to.be.rejectedWith(
      ModelError,
      /username/
    );
  });
  it("should raise unique email", async () => {
    await UserModel.create(userData1);
    await expect(UserModel.create(userData2)).to.be.rejectedWith(
      ModelError,
      /email/
    );
  });
});
