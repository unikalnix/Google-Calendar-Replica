import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/google-calendar-replica`, {
      maxPoolSize: 10,
    });
    console.log("Database connection successful");

    mongoose.connection.on("disconnect", () =>
      console.warn("Database disconnected")
    );
    mongoose.connection.on("reconnected", () =>
      console.log("Database Reconnected")
    );
    mongoose.connection.on("error", () => console.error("Database connection"));
  } catch (error) {
    throw new Error(error.message);
  }
};

export default connectDB;
