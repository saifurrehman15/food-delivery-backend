import { sendResponse } from "../../helpers/send-response.js";
import { restaurantServiceModule } from "./restaurant.service.js";
import { restaurantApplicationValidator } from "./validators/restaurant.validator.js";

class Restaurant {
  #restaurantService;
  #restaurantRegisterValidator;
  constructor() {
    this.#restaurantService = restaurantServiceModule;
    this.#restaurantRegisterValidator = restaurantApplicationValidator;
    this.registerApplications = this.registerApplications.bind(this);
    this.getApplications = this.getApplications.bind(this);
  }

  async registerApplications(req, res) {
    try {
      const user_id = req.user._id;
      const { error, value } = this.#restaurantRegisterValidator.validate(
        req.body
      );
      if (error) {
        return sendResponse(res, 400, {
          message: error.message,
          data: null,
        });
      }
      const registerResponse = await this.#restaurantService.registerRestaurant(
        { value, user_id }
      );
      if (registerResponse.error) {
        return sendResponse(res, registerResponse.status, {
          message: registerResponse.message,
          data: null,
        });
      }
      return sendResponse(res, registerResponse.status, {
        message: registerResponse.message,
        data: registerResponse.data,
      });
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, {
        message: "Internal server error!",
        data: null,
      });
    }
  }

  async getApplications(req, res) {
    try {
      const user_id = req.user._id;
      const getApplicationsResponse =
        await this.#restaurantService.getApplicationsService(user_id);
      if (getApplicationsResponse.error) {
        return sendResponse(res, getApplicationsResponse.status, {
          message: getApplicationsResponse.message,
          data: null,
        });
      }
      return sendResponse(res, getApplicationsResponse.status, {
        message: getApplicationsResponse.message,
        data: getApplicationsResponse.data,
      });
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, {
        message: "Internal server error!",
        data: null,
      });
    }
  }
}

export const restaurantControllerModule = new Restaurant();
