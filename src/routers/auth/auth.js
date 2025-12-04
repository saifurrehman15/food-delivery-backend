import express from "express";
import { authControllerModule } from "../../app/auth/auth.controller.js";
import { middlewareModule } from "../../app/middlewares/user.middleware.js";

const router = express.Router();

router.post("/login", authControllerModule.login);
router.post("/register", authControllerModule.register);
router.post(
  "/refresh-token",
  middlewareModule.authenticateUser,
  authControllerModule.refreshToken
);
router.post(
  "/forget-password",
  authControllerModule.forgetPassword
);

router.post(
  "/change-password",
  authControllerModule.changePassword
);
export default router;
