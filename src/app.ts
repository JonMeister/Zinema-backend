/**
 * Main Express application entry point for Zinema backend API.
 * 
 * Configures middleware, routes, and starts the server with database connection.
 * Provides user authentication, profile management, and password reset functionality.
 */
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/routes";
import { connectDB } from "./config/database";

/**
 * Middleware configuration
 */

// Load environment variables from .env file
dotenv.config();

/**
 * Express application instance.
 */
const app = express();

/**
 * Configure middleware for the Express application.
 * 
 * Sets up JSON parsing, URL encoding, and CORS for API requests.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * Mount the API routes under the /api/ prefix.
 * 
 * All API endpoints will be accessible at /api/users/*, etc.
 */
app.use("/api/", routes);

/**
 * Health check endpoint to verify server status.
 * 
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns Simple text response indicating server is running.
 */
app.get("/", (req: Request, res: Response) => res.send("Server is running"));

/**
 * Starts the Express server and connects to the database.
 * 
 * Attempts to connect to MongoDB and then starts listening on the configured port.
 * Exits the process if database connection fails.
 * 
 * @async
 * @function startServer
 * @throws {Error} Exits process if database connection fails.
 */
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      if (process.env.NODE_ENV === "development") {
        console.log(`Server running on http://localhost:${PORT}`);
      }
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
