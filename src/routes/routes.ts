import express from "express";
import userRoutes from "./userRoutes";
import videoRoutes from "./videoRoutes";
import favoriteRoutes from "./favoriteRoutes";

const router = express.Router();

/**
 * Mount project routes.
 */
router.use("/users", userRoutes);

router.use("/videos", videoRoutes);

router.use("/favorites", favoriteRoutes);

/**
 * Export the main router instance.
 * This is imported in `app.ts` and mounted under `/api/`.
 */
export default router;
