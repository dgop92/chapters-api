import { ChapterModel } from "./chapter.model";
import {
  createOne,
  updateOne,
  getOne,
  deleteOne,
} from "../../common/crudControllers";

export const chapterControllers = {
  deleteOne: deleteOne(ChapterModel),
  updateOne: updateOne(ChapterModel),
  getOne: getOne(ChapterModel),
  createOne: createOne(ChapterModel),
};
