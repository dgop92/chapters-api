import { expect } from "chai";
import { ChapterModel } from "../chapter.model";
import { checkResourceExists } from "@db/genericOperations";
import { ResourceNotFoundError } from "@db/customErrors";

const chapterData1 = {
  name: "ACM",
  faculty: "Ingenierias",
  departament: "Dpto. Ingeniería de Sistemas y Computación",
  career: "Ingeniería de Sistemas",
};

const chapterData2 = {
  name: "randomChapter",
  faculty: "Urbanismo",
};

describe("#ChapterModel", () => {
  let chapterModel: ChapterModel;

  before("intanciate chapter model", async function () {
    chapterModel = new ChapterModel();
  });

  it("should create a chapter", async () => {
    const chapter1 = await chapterModel.create(chapterData1);
    const chapter2 = await chapterModel.create(chapterData2);

    console.log(chapter1);
    console.log(chapter2);

    await expect(
      checkResourceExists("chapter", { field: "pk", value: chapter1.pk })
    ).to.eventually.equal(true);
    await expect(
      checkResourceExists("chapter", { field: "pk", value: chapter2.pk })
    ).to.eventually.equal(true);
  });

  it("should retrieve a chapter", async () => {
    const chapter1 = await chapterModel.create(chapterData1);
    const chapter1Retrieved = await chapterModel.detail(chapter1.pk);

    expect(chapter1.pk).to.be.equal(chapter1Retrieved.pk);
  });
  it("should raise ResourceNotFoundError while trying to retrieve a chapter", async () => {
    await expect(chapterModel.detail(520)).to.be.rejectedWith(
      ResourceNotFoundError
    );
  });
  it("should update chapter", async () => {
    const chapter2 = await chapterModel.create(chapterData2);
    const newChapter = await chapterModel.update(chapterData1, chapter2.pk);
    expect(newChapter).to.be.eql({ ...chapterData1, pk: newChapter.pk });
  });
  it("should delete chapter", async () => {
    const chapter1 = await chapterModel.create(chapterData1);
    await chapterModel.delete(chapter1.pk);
    await expect(
      checkResourceExists("chapter", { field: "pk", value: chapter1.pk })
    ).to.be.rejectedWith(ResourceNotFoundError);
  });
});
