import { sendResponse } from "../../helpers/send-response.js";
import { userModel } from "../auth/auth.model.js";
import jwt from "jsonwebtoken";
class USERMIDDLEWARE {
  #userService;
  constructor() {
    this.#userService = userModel;
    this.authenticateUser = this.authenticateUser.bind(this);
  }

  async authenticateUser(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("TOKEN", token);

    if (!token) {
      return sendResponse(res, 401, {
        message: "Unauthorized!",
        data: null,
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.AUTH_SECRET);

      if (!decoded) {
        return sendResponse(res, 403, {
          message: "token expired!",
          data: null,
        });
      }

      const user = await this.#userService.findById(decoded._id).lean();

      if (!user) {
        return sendResponse(res, 401, {
          message: "User not found!",
          data: null,
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return sendResponse(res, 401, {
          message: "jwt expired",
          data: null,
          expiredAt: error.expiredAt,
        });
      }
      return sendResponse(res, 500, {
        message: "Internal Server Error",
        data: null,
      });
    }
  }

  async isAdmin(req, res, next) {
    try {
      const { user } = req;
      if (user.role !== "admin") {
        return sendResponse(res, 403, {
          message: "You need to be an admin to perform this action",
          data: null,
        });
      }
      next();
    } catch (error) {
      return sendResponse(res, 500, {
        message: "Internal Server Error",
        data: null,
      });
    }
  }
}

export const middlewareModule = new USERMIDDLEWARE();
