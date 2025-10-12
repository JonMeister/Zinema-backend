import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/routes";
import { connectDB } from "./config/database";

dotenv.config();

const app = express();

/**
 * Middleware configuration
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * Initialize database connection
 */
connectDB();

/**
 * Mount the API routes
 */
app.use("/api/", routes);

/**
 * Health check endpoint
 */
app.get("/", (req: Request, res: Response) => res.send("Server is running"));

/**
 * Start the server 
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

startServer();

export default app;
