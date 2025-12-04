import { transporter } from "../../utils/configs/node-mailer-config/index.js";
import { userModel } from "./auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AUTHSERVICE {
  constructor() {
    this.userSchema = userModel;
  }

  async loginService(value) {
    const findUser = await this.userSchema
      .findOne({ email: value.email })
      .lean();

    if (!findUser) {
      return {
        error: true,
        message: "User is not exists!",
        status: 404,
      };
    }
    
    if (findUser.account_type !== "google") {
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

    if (!newUser) {
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

  async forgetPasswordService(email) {
    const findUser = await this.userSchema.findOne({ email });

    if (!findUser) {
      return {
        error: true,
        message: "User is not exists!",
        status: 404,
      };
    }

    const token = jwt.sign({ email: findUser.email }, process.env.AUTH_SECRET, {
      expiresIn: "1h",
    });

    const info = await transporter.sendMail({
      from: "saifrizwankhan786@gmail.com",
      to: email,
      subject: "Reset Your Password",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333333;">Password Reset Request</h2>
    <p style="font-size: 16px; color: #555555;">
      Hi,
    </p>
    <p style="font-size: 16px; color: #555555;">
      We received a request to reset your password. Click the button below to reset it:
    </p>
    <a href="http://localhost:3000/reset-password?token=${token}" 
       style="display: inline-block; margin: 20px 0; padding: 12px 25px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
       Reset Password
    </a>
    <p style="font-size: 14px; color: #999999;">
      If you didn't request a password reset, you can safely ignore this email.
    </p>
    <p style="font-size: 16px; color: #555555; margin-top: 30px;">
      Thanks,<br/>
      <strong>Your App Team</strong>
    </p>
  </div>
  `,
    });
    console.log(info.rejected);

    if (!info.rejected.length) {
      await this.userSchema.updateOne(
        { email: findUser.email },
        { $set: { token } }
      );
    }

    return {
      error: false,
      message: "Forget password successfully!",
      status: 200,
    };
  }

  async changePasswordService(value) {
    if (!value.token) {
      return {
        error: true,
        message: "Token is required!",
        status: 400,
      };
    }

    let decoded = jwt.verify(value.token, process.env.AUTH_SECRET);
    if (!decoded) {
      return {
        error: true,
        message:
          "The link you used has expired. For security, please request a fresh password reset.",
        status: 400,
      };
    }
    const findUser = await this.userSchema.findOne({ token: value.token });

    if (!findUser) {
      return {
        error: true,
        message: "User is not exists!",
        status: 404,
      };
    }

    const hashed = await bcrypt.hash(value.password, 10);

    await this.userSchema.updateOne(
      { token: value.token },
      { $set: { password: hashed }, $unset: { token: "" } }
    );

    return {
      error: false,
      message: "Password changed successfully!",
      status: 200,
    };
  }
}

export const authServiceModel = new AUTHSERVICE();
