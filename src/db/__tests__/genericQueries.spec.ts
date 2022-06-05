import { expect } from "chai";
import { getCrudQueries } from "../crudQueries";

describe("#genericQueries", () => {
  const crudOperations = getCrudQueries("brand", "pk");
  const data = { name: "juan", active: false };

  it("should build createOne query successfully", () => {
    const query = crudOperations.createOneQuery(data);
    console.log(query);
    expect(query.values).to.have.members(Object.values(data));
  });
  it("should build updateOneQuery successfully", () => {
    const query = crudOperations.updateOneQuery(data, 3);
    console.log(query);
    expect(query.values).to.have.members([...Object.values(data), 3]);
  });
  it("should build deleteOneQuery successfully", () => {
    const query = crudOperations.deleteOneQuery(5);
    console.log(query);
    expect(query.values[0]).to.be.equal(5);
  });
  it("should build getOneQuery successfully", () => {
    const query = crudOperations.getOneQuery(52);
    console.log(query);
    expect(query.values[0]).to.be.equal(52);
  });
});
