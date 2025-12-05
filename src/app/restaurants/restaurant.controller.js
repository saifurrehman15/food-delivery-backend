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
    this.updateApplicationStatus = this.updateApplicationStatus.bind(this);
  }

  async registerApplications(req, res) {
    try {
      const user_id = req.user._id;
      const { error, value } = this.#restaurantRegisterValidator.validate(
        req.body
      );
      if (error) {
        return sendResponse(res, 400, {
          error: true,
          message: error.message,
          data: null,
        });
      }
      const registerResponse = await this.#restaurantService.registerRestaurant(
        { value, user_id }
      );
      if (registerResponse.error) {
        return sendResponse(res, registerResponse.status, {
          error: true,
          message: registerResponse.message,
          data: null,
        });
      }
      return sendResponse(res, registerResponse.status, {
        error: false,
        message: registerResponse.message,
        data: registerResponse.data,
      });
    } catch (error) {
      console.log("ERROR PLACED",error);
      return sendResponse(res, 500, {
        error: true,
        message: "Internal server error!",
        data: null,
      });
    }
  }

  async getApplications(req, res) {
    try {
      const limit = Number(req.query.limit) || 5;
      const page = Number(req.query.page) || 1;
      const status = req.query.status || "";
      const getApplicationsResponse =
        await this.#restaurantService.getApplicationsService({
          limit,
          page,
          status
        });
      if (getApplicationsResponse.error) {
        return sendResponse(res, getApplicationsResponse.status, {
          error: true,
          message: getApplicationsResponse.message,
          data: null,
        });
      }
      return sendResponse(res, getApplicationsResponse.status, {
        error: false,
        message: getApplicationsResponse.message,
        data: getApplicationsResponse.data[0],
      });
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, {
        error: true,
        message: "Internal server error!",
        data: null,
      });
    }
  }

  async updateApplicationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updateApplicationStatusResponse =
        await this.#restaurantService.updateApplicationStatusService({
          id,
          status,
        });
      if (updateApplicationStatusResponse.error) {
        return sendResponse(res, updateApplicationStatusResponse.status, {
          error: true,
          message: updateApplicationStatusResponse.message,
          data: null,
        });
      }
      return sendResponse(res, updateApplicationStatusResponse.status, {
        error: false,
        message: updateApplicationStatusResponse.message,
        data: updateApplicationStatusResponse.data,
      });
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, {
        error: true,
        message: "Internal server error!",
        data: null,
      });
    }
  }
}

export const restaurantControllerModule = new Restaurant();
