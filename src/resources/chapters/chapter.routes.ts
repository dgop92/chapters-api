import { validateLookUpField } from "common/middlewares";
import { Router } from "express";
import { chapterControllers } from "./chapter.controller";

const router = Router();

router.route("/").post(chapterControllers.createOne);

router
  .route("/:id")
  .all(validateLookUpField)
  .get(chapterControllers.getOne)
  .put(chapterControllers.updateOne)
  .delete(chapterControllers.deleteOne);

export default router;
