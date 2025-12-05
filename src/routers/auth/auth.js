import express from "express";
import { authControllerModule } from "../../app/auth/auth.controller.js";
import passport from "passport";
import { tokenGenerator } from "../../helpers/token-generator.js";
import { middlewareModule } from "../../middlewares/user.middleware.js";

const router = express.Router();

router.post("/login", authControllerModule.login);
router.post("/register", authControllerModule.register);
router.post(
  "/refresh-token",
  middlewareModule.authenticateUser,
  authControllerModule.refreshToken
);
router.post("/forget-password", authControllerModule.forgetPassword);

router.post("/change-password", authControllerModule.changePassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  function (req, res) {
    const payload = {
      _id: req?.user._id,
      email: req.user.email,
    };
    const { accessToken, refreshToken } = tokenGenerator(payload);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    // Send token to frontend
    res.redirect(`http://localhost:3000`);
  }
);
export default router;
