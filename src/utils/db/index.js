import mongoose from "mongoose";

const connectDb = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB");
    }
  } catch (error) {
    console.log(error);
  }
};

export default connectDb