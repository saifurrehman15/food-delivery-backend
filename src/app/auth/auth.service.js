import { userModel } from "./auth.model.js";
import bcrypt from "bcryptjs";
class AUTHSERVICE {
  constructor() {
    this.userSchema = userModel;
  }

  async loginService(value) {
    const findUser = await this.userSchema.findOne({ email: value.email }).lean();

    if (!findUser) {
      return {
        error: true,
        message: "User is not exists!",
        status: 404,
      };
    }

    const isPasswordMatch = await bcrypt.compare(
      value.password,
      findUser.password
    );

    if (!isPasswordMatch) {
      return {
        error: true,
        message: "Invalid credientials!",
        status: 400,
      };
    }

    return {
      error: false,
      message: "Login successfully!",
      status: 200,
      data: findUser,
    };
  }

  async registerService(value) {
    const findUser = await this.userSchema.findOne({ email: value.email });

    if (findUser) {
      return {
        error: true,
        message: "User already exists!",
        status: 403,
      };
    }

    const hashed = await bcrypt.hash(value.password, 10);
    value.password = hashed;

    const newUser = await this.userSchema.create(value);

    if(!newUser) {
      return {
        error: true,
        message: "User registration failed!",
        status: 500,
      };
    }

    return {
      error: false,
      message: "User registered successfully!",
      status: 200,
      data: newUser,
    };
  }
}

export const authServiceModel = new AUTHSERVICE();
