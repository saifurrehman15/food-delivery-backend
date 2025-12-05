import { sendResponse } from "../../helpers/send-response.js";
import { riderApplicationValidator } from "./validators/rider.validator.js";
import { ridersServiceModule } from "./riders.service.js";

class Riders {
  #riderValidate;
  #ridersService;
  constructor() {
    this.#riderValidate = riderApplicationValidator;
    this.#ridersService = ridersServiceModule;
    this.registerRiders = this.registerRiders.bind(this);
    this.getRiders = this.getRiders.bind(this);
    this.updateRiderStatus = this.updateRiderStatus.bind(this);
  }

  async registerRiders(req, res) {
    try {
      const user_id = req.user._id;
      const { error, value } = this.#riderValidate.validate(req.body);
      if (error) {
        return sendResponse(res, 400, {
          error: true,
          message: error.message,
          data: null,
        });
      }
      console.log(user_id);

      const registerRidersResponse =
        await this.#ridersService.registerRidersService({ ...value, user_id });
      if (registerRidersResponse.error) {
        return sendResponse(res, registerRidersResponse.status, {
          error: true,
          message: registerRidersResponse.message,
          data: null,
        });
      }
      return sendResponse(res, registerRidersResponse.status, {
        error: false,
        message: registerRidersResponse.message,
        data: registerRidersResponse.data,
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

  async getRiders(req, res) {
    try {
      const limit = Number(req.query.limit) || 5;
      const page = Number(req.query.page) || 1;
      const status = req.query.status || "";
      
      const getRidersResponse = await this.#ridersService.getRidersService({
        limit,
        page,
        status
      });
      
      if (getRidersResponse.error) {
        return sendResponse(res, getRidersResponse.status, {
          error: true,
          message: getRidersResponse.message,
          data: null,
        });
      }
      
      return sendResponse(res, getRidersResponse.status, {
        error: false,
        message: getRidersResponse.message,
        data: getRidersResponse.data[0],
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

  async updateRiderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const updateRiderStatusResponse = await this.#ridersService.updateRiderStatusService({
        id,
        status,
      });
      
      if (updateRiderStatusResponse.error) {
        return sendResponse(res, updateRiderStatusResponse.status, {
          error: true,
          message: updateRiderStatusResponse.message,
          data: null,
        });
      }
      
      return sendResponse(res, updateRiderStatusResponse.status, {
        error: false,
        message: updateRiderStatusResponse.message,
        data: updateRiderStatusResponse.data,
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

export const ridersControllerModule = new Riders();
