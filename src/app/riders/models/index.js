import mongoose from "mongoose";

const ridersModel = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /^\S+@\S+$/,
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9+\-\s()]+$/,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{5}-[0-9]{7}-[0-9]$/,
    },

    address: {
      name: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleType: {
      type: String,
      required: true,
      enum: ["motorcycle", "bicycle", "car", "scooter"],
    },
    vehicleModel: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      enum: ["new", "1-2", "3-5", "5+"],
    },

    availability: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "weekends"],
    },

    emergencyContact: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        match: /^[0-9+\-\s()]+$/,
      },
      relation: {
        type: String,
        required: true,
        trim: true,
      },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const riderApplications =
  mongoose.models.riderApplications ||
  mongoose.model("riderApplications", ridersModel);
