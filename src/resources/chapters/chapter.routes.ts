import { isAdmin, protectedEndpoint } from "auth/middlewares";
import {
  isAdminOrChapterExecutive,
  validateLookUpField,
} from "common/middlewares";
import { Router } from "express";
import { chapterControllers } from "./chapter.controller";

const router = Router();

router
  .route("/")
  .post([protectedEndpoint(), isAdmin, chapterControllers.createOne]);

router
  .route("/:id")
  .all(validateLookUpField)
  .get(chapterControllers.getOne)
  .put([
    protectedEndpoint(),
    isAdminOrChapterExecutive,
    chapterControllers.updateOne,
  ])
  .patch(
    protectedEndpoint(),
    isAdminOrChapterExecutive,
    chapterControllers.updateOne
  )
  .delete([isAdmin, chapterControllers.deleteOne]);

export default router;
