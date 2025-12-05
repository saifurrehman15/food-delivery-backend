import express from "express";
import { userControllerModule } from "../../app/user/user.controller.js";
import { middlewareModule } from "../../middlewares/user.middleware.js";

const router = express.Router();

router.get(
  "/get-user",
  middlewareModule.authenticateUser,
  userControllerModule.getUser
);

export default router;
