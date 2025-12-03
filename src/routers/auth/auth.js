import express from "express";
import { authControllerModule } from "../../app/auth/auth.controller.js";

const router = express.Router();

router.post("/login", authControllerModule.login);
router.post("/register", authControllerModule.register);

export default router;