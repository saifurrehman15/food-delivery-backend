import express from "express";
import { middlewareModule } from "../../middlewares/user.middleware.js";
import { ridersControllerModule } from "../../app/riders/riders.controller.js";

const router = express.Router();

router.post(
  "/register-rider",
  middlewareModule.authenticateUser,
  ridersControllerModule.registerRiders
);

router.get(
  "/get-riders-application",
  [middlewareModule.authenticateUser, middlewareModule.isAdmin],
  ridersControllerModule.getRiders
);

export default router;
