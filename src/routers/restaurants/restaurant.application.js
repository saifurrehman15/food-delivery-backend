import express from "express";
import { middlewareModule } from "../../app/middlewares/user.middleware.js";
import { restaurantControllerModule } from "../../app/restaurants/restaurant.controller.js";

const router = express.Router();

router.post(
  "/register-restaurant",
  middlewareModule.authenticateUser,
  restaurantControllerModule.registerApplications
);

router.get(
  "/get-applications",
  [middlewareModule.authenticateUser, middlewareModule.isAdmin],
  restaurantControllerModule.getApplications
);

export default router;
