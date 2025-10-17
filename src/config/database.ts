import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Establish a connection to the MongoDB database.
 *
 * Uses the connection string provided in the environment variable `MONGO_URI`.
 * On success, logs a confirmation message. On failure, logs the error and
 * terminates the process with exit code 1.
 */
export const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

<<<<<<< HEAD
    await mongoose.connect(process.env.MONGO_URI, {
      // @ts-ignore: Mongoose types now infer options automatically
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
=======
    await mongoose.connect(process.env.MONGO_URI);
>>>>>>> 39b47680c3c12a819cebee4728e04d20c7033b3d
    console.log("Connected to MongoDB");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error connecting to MongoDB:", error.message);
    } else {
      console.error("Unknown error connecting to MongoDB:", error);
    }
    process.exit(1);
  }
};

/**
 * Disconnect from the MongoDB database.
 *
 * Gracefully closes the active connection and logs the result.
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error disconnecting from MongoDB:", error.message);
    } else {
      console.error("Unknown error disconnecting from MongoDB:", error);
    }
  }
};
