import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    cuisineType: {
      type: String,
      required: true,
      enum: [
        "italian",
        "chinese",
        "indian",
        "mexican",
        "american",
        "thai",
        "japanese",
        "mediterranean",
        "other",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
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
    website: {
      type: String,
      match: /^https?:\/\/.+/,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
    },
    yearsInBusiness: {
      type: String,
      required: true,
      enum: ["new", "1-2", "3-5", "6-10", "10+"],
    },
    dailyOrders: {
      type: String,
      required: true,
      enum: ["1-10", "11-25", "26-50", "51-100", "100+"],
    },
    deliveryService: {
      type: String,
      required: true,
      enum: ["own", "third-party", "both", "pickup-only"],
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const restaurantApplications =
  mongoose.models.registerations ||
  mongoose.model("registerations", restaurantSchema);
