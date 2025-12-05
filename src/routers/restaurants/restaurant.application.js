import express from "express";
import { restaurantControllerModule } from "../../app/restaurants/restaurant.controller.js";
import { middlewareModule } from "../../middlewares/user.middleware.js";

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

router.put(
  "/update-status/:id",
  [middlewareModule.authenticateUser, middlewareModule.isAdmin],
  restaurantControllerModule.updateApplicationStatus
);

export default router;
