import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    account_type: {
      type: String,
      enum: ["google", "credentials"],
      default: "credentials",
    },
    role: {
      type: String,
      enum: ["admin", "user", "owner", "rider"],
      default: "user",
    },
    token: {
      type: String,
    },
    avatar: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

export const userModel =
  mongoose.models.users || mongoose.model("users", userSchema);
