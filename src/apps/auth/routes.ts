import { Router } from "express";
import { signin, me } from "./controllers";
import { protectedEndpoint } from "./middlewares";

const router = Router();

router.route("/login").post(signin);
router.route("/me").get(protectedEndpoint(), me);

export default router;
