import { sendResponse } from "../../helpers/send-response.js";

class USERCONTROLLER {
  async getUser(req, res) {
    try {
      const { user } = req;
      delete user.password;
      return sendResponse(res, 200, {
        error: false,
        message: "User fetched successfully!",
        data: user,
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

export const userControllerModule = new USERCONTROLLER();
