import { ChapterModel } from "./chapter.model";
import {
  createOne,
  updateOne,
  getOne,
  deleteOne,
} from "../../common/crudControllers";

const model = new ChapterModel();

export const chapterControllers = {
  deleteOne: deleteOne(model),
  updateOne: updateOne(model),
  getOne: getOne(model),
  createOne: createOne(model),
};
