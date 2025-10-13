import express from "express";
import userRoutes from "./userRoutes";

const router = express.Router();

/**
 * Mount project routes.
 */
router.use("/users", userRoutes);

/**
 * Export the main router instance.
 * This is imported in `app.ts` and mounted under `/api/`.
 */
export default router;
