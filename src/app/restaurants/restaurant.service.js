import dayjs from "dayjs";
import bcrypt from "bcryptjs";
import { dbQueries } from "../../utils/db/queries.js";
import { userModel } from "../auth/auth.model.js";
import { restaurantApplications } from "./models/restaurant.model.js";
import { transporter } from "../../utils/configs/node-mailer-config/index.js";
import generateOtp from "../../helpers/generate-otp.js";
import cron from "node-cron";

class RestaurantService {
  #applicationModel;
  #userModel;
  #dbQueries;
  constructor() {
    this.#applicationModel = restaurantApplications;
    this.registerRestaurant = this.registerRestaurant.bind(this);
    this.#dbQueries = dbQueries;
    this.#userModel = userModel;
    this.updateApplicationStatusService =
      this.updateApplicationStatusService.bind(this);
    this.getApplicationsService = this.getApplicationsService.bind(this);
    cron.schedule("0 0 * * *", async () => {
      try {
        const now = dayjs();

        let verifiedUpdate = await this.#userModel.updateMany(
          {
            registeration_payment_time: { $lt: now.toDate() },
            isVerifiedOwner: true,
            role: { $in: ["owner"], $nin: ["admin"] },
          },
          { $set: { isVerifiedOwner: false } }
        );

        if (verifiedUpdate) {
          await this.#userModel.updateMany(
            {
              registeration_payment_time: { $lt: now.toDate() },
              isVerifiedOwner: false,
              role: { $in: ["owner"], $nin: ["admin"] },
            },
            {
              $pull: { role: "owner" },
              $set: { registeration_payment_time: null },
            }
          );
        }

        console.log("Cron OK");
      } catch (err) {
        console.error("Cron error:", err);
      }
    });
  }

  async registerRestaurant({ value, user_id }) {
    try {
      const findApplication = await this.#applicationModel.findOne({
        user_id,
        status: "pending",
      });

      if (findApplication) {
        return {
          error: true,
          message: "You have already registered!",
          status: 403,
        };
      }
      
      const newApplication = await this.#applicationModel.create({
        ...value,
        user_id,
      });
      if (!newApplication) {
        return {
          error: true,
          message: "Restaurant registration failed!",
          status: 500,
        };
      }

      return {
        error: false,
        message: "Restaurant registered successfully! Please check your email for OTP verification.",
        status: 200,
        data: newApplication,
      };
    } catch (error) {
      console.log(error);
      return {
        error: true,
        message: "Internal server error!",
        status: 500,
      };
    }
  }

  async getApplicationsService({ limit, page, status }) {
    try {
      let query = {};
      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;
      const findApplications = await this.#applicationModel.aggregate([
        this.#dbQueries.paginationQuery(
          query,
          "registerations",
          skip,
          limit,
          page
        ),
      ]);
      if (!findApplications) {
        return {
          error: true,
          message: "No applications found!",
          status: 404,
        };
      }
      return {
        error: false,
        message: "Applications found!",
        status: 200,
        data: findApplications,
      };
    } catch (error) {
      console.log(error);
      return {
        error: true,
        message: "Internal server error!",
        status: 500,
      };
    }
  }

  async updateApplicationStatusService({ id, status }) {
    try {
      const findApplication = await this.#applicationModel.findOneAndUpdate(
        { _id: id, status: "pending" },
        { status },
        { new: true }
      );

      if (!findApplication) {
        return {
          error: true,
          message:
            "Application can only be updated if it is currently pending.",
          status: 404,
        };
      }
      if (status === "hold") {
        const findUser = await this.#userModel.findOneAndUpdate(
          { _id: findApplication.user_id },
          {
            $addToSet: { role: "owner" },
            $set: {
              registeration_payment_time: dayjs()
                .add(1, "month")
                .format("YYYY-MM-DD HH:mm:ss"),
            },
          },

          { new: true }
        );
        console.log(findUser);

        if (!findUser) {
          return {
            error: true,
            message: "User not found!",
            status: 404,
          };
        }
      }
      return {
        error: false,
        message: "Application updated successfully!",
        status: 200,
        data: findApplication,
      };
    } catch (error) {
      console.log(error);
      return {
        error: true,
        message: "Internal server error!",
        status: 500,
      };
    }
  }
}

export const restaurantServiceModule = new RestaurantService();
