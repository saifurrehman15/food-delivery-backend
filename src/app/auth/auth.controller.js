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
    this.refreshToken = this.refreshToken.bind(this);
    this.forgetPassword = this.forgetPassword.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }
  // ** LOGIN CONTROLLER ** \\
  async login(req, res) {
    try {
      const { error, value } = this.#userLoginValidator.validate(req.body);

      if (error) {
        return sendResponse(res, 400, {
          error: true,
          message: error.message,
          data: null,
        });
      }
      const loginResponse = await this.#userService.loginService(value);

      if (loginResponse.error) {
        return sendResponse(res, loginResponse.status, {
          error: true,
          message: loginResponse.message,
          data: null,
        });
      }
      const payload = {
        email: loginResponse.data.email,
        _id: loginResponse.data._id,
      };
      const { accessToken, refreshToken } = this.#tokenGenerate(payload);
      const obj = {
        ...loginResponse.data,
        token: { accessToken, refreshToken },
      };
      delete obj.password;


      return sendResponse(res, loginResponse.status, {
        error: false,
        message: loginResponse.message,
        data: obj,
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

  // ** REGISTER CONTROLLER ** \\
  async register(req, res) {
    try {
      const { error, value } = this.#userRegisterValidator.validate(req.body);

      if (error) {
        return sendResponse(res, 400, {
          error: true,
          message: error.message,
          data: null,
        });
      }
      const registerResponse = await this.#userService.registerService(value);

      if (registerResponse.error) {
        return sendResponse(res, registerResponse.status, {
          error: true,
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
        error: false,
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
        error: true,
        message: "Internal server error!",
        data: null,
      });
    }
  }

  // ** REFRESH TOKEN CONTROLLER ** \\
  async refreshToken(req, res) {
    try {
      const { user } = req;
      const payload = {
        email: user.email,
        _id: user._id,
      };

      const { accessToken, refreshToken } = this.#tokenGenerate(payload);
      delete user.password;
      return sendResponse(res, 200, {
        error: false,
        message: "Refresh token success!",
        data: {
          user,
          token: {
            accessToken,
            refreshToken,
          },
        },
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

  // ** FORGET PASSWORD CONTROLLER ** \\
  async forgetPassword(req, res) {
    try {
      const { email } = req.body;
      const forgetPasswordResponse =
        await this.#userService.forgetPasswordService(email);

      if (forgetPasswordResponse.error) {
        return sendResponse(res, forgetPasswordResponse.status, {
          error: true,
          message: forgetPasswordResponse.message,
          data: null,
        });
      }

      return sendResponse(res, forgetPasswordResponse.status, {
        error: false,
        message: forgetPasswordResponse.message,
        data: null,
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

  // ** CHANGE PASSWORD CONTROLLER ** \\
  async changePassword(req, res) {
    try {
      const { password } = req.body;
      const changePasswordResponse =
        await this.#userService.changePasswordService({
          password,
          token: req.query.token,
        });

      if (changePasswordResponse.error) {
        return sendResponse(res, changePasswordResponse.status, {
          error: true,
          message: changePasswordResponse.message,
          data: null,
        });
      }

      return sendResponse(res, changePasswordResponse.status, {
        error: false,
        message: changePasswordResponse.message,
        data: null,
      });
    } catch (error) {
      console.log(error);
      if (error.name === "TokenExpiredError") {
        return sendResponse(res, 401, {
          error: true,
          message:
            "Your session has expired. Please request a new password reset link.",
          data: null,
          expiredAt: error.expiredAt,
        });
      }

      return sendResponse(res, 500, {
        error: true,
        message: "Internal server error!",
        data: null,
      });
    }
  }
}

export const authControllerModule = new AUTHCONTROLLER();
