import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/smart-order-toolkit";
    await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error(`An unexpected error occurred during database connection`);
    }
    process.exit(1);
  }
};
