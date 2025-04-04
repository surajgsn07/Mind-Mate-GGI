import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );

    console.log(
      `Mongodb connected with host ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("SRC :: DB :: index.js :: mongodb connection failed ", error);
  }
};

export default connectDB;
