import { Router } from "express";
import { signin, me, myProfile, updateProfile } from "./controllers";
import { protectedEndpoint } from "./middlewares";

const authRouter = Router();
const usersRouter = Router();

// may in the future add reset password, change password
authRouter.route("/jwt/create").post(signin);

usersRouter.use(protectedEndpoint());
usersRouter.route("/me").get(me);
usersRouter
  .route("/profile")
  .get(myProfile)
  .put(updateProfile)
  .patch(updateProfile);

export { authRouter, usersRouter };
