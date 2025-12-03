import { sendResponse } from "../../helpers/send-response.js";
import { tokenGenerator } from "../../helpers/token-generator.js";
import { userSchemaLogin, userSchemaRegister } from "./auth.dto.js";
import { authServiceModel } from "./auth.service.js";

class AUTHCONTROLLER {
  #tokenGenerate;
  #userLoginValidator;
  #userRegisterValidator;
  #userService;
  constructor() {
    this.#tokenGenerate = tokenGenerator;
    this.#userLoginValidator = userSchemaLogin;
    this.#userRegisterValidator = userSchemaRegister;
    this.#userService = authServiceModel;
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }
  // ** LOGIN CONTROLLER ** \\
  async login(req, res) {
    try {
      console.log(req.body);

      const { error, value } = this.#userLoginValidator.validate(req.body);
      console.log(value);

      if (error) {
        return sendResponse(res, 400, {
          message: error.message,
          data: null,
        });
      }
      const loginResponse = await this.#userService.loginService(value);

      if (loginResponse.error) {
        return sendResponse(res, loginResponse.status, {
          message: loginResponse.message,
          data: null,
        });
      }
      const payload = {
        email: loginResponse.data.email,
        _id: loginResponse.data._id,
      };
      const { accessToken, refreshToken } = this.#tokenGenerate(payload);
      const obj = { ...loginResponse.data };
      delete obj.password;

      console.log(loginResponse.data);

      return sendResponse(res, loginResponse.status, {
        message: loginResponse.message,
        data: obj,
        token: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.log(error);

      return sendResponse(res, 500, {
        message: "Internal server error!",
        data: null,
      });
    }
  }

  // ** REGISTER CONTROLLER ** \\
  async register(req, res) {
    try {
      const { error, value } = this.#userRegisterValidator.validate(req.body);

      if (error) {
        return sendResponse(res, 400, {
          message: error.message,
          data: null,
        });
      }
      const registerResponse = await this.#userService.registerService(value);

      if (registerResponse.error) {
        return sendResponse(res, registerResponse.status, {
          message: registerResponse.message,
          data: null,
        });
      }

      const payload = {
        email: registerResponse.data.email,
        _id: registerResponse.data._id,
      };
      const { accessToken, refreshToken } = this.#tokenGenerate(payload);
      const obj = { ...registerResponse.data };
      delete obj.password;

      return sendResponse(res, registerResponse.status, {
        message: registerResponse.message,
        data: obj,
        token: {
          accessToken,
          refreshToken,
        },
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

export const authControllerModule = new AUTHCONTROLLER();
