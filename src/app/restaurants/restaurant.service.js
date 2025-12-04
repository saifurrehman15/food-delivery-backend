import { restaurantApplications } from "./models/restaurant.model.js";

class RestaurantService {
  #applicationModel;
  constructor() {
    this.#applicationModel = restaurantApplications;
    this.registerRestaurant = this.registerRestaurant.bind(this);
    this.getApplicationsService = this.getApplicationsService.bind(this);
  }

  async registerRestaurant({ value, user_id }) {
    try {
      const findApplication = await this.#applicationModel.findOne({
        user_id,
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
        message: "Restaurant registered successfully!",
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

  async getApplicationsService(user_id) {
    try {
      const findApplications = await this.#applicationModel.find({ user_id });
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
}

export const restaurantServiceModule = new RestaurantService();
