import express from "express";
import { authModule } from "../../app/auth/auth.controller.js";

const router = express.Router()

router.post("/login", authModule.login);

export default router;