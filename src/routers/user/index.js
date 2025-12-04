import express from "express";
import { middlewareModule } from "../../app/middlewares/user.middleware.js";
import { userControllerModule } from "../../app/user/user.controller.js";

const router = express.Router();

router.get(
  "/get-user",
  middlewareModule.authenticateUser,
  userControllerModule.getUser
);

export default router;
