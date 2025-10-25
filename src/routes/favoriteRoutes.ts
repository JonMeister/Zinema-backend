import { Router } from "express";
import { favoriteController } from "../controllers/favoriteController";
import { authenticateToken } from "../utils/auth";

const router = Router();

/**
 * @route POST /api/favorites
 * @description Add a video to user's favorites
 * @header {string} Authorization - Bearer token for authentication
 * @body {string} videoId - Pexels video ID
 * @access Private
 */
router.post("/", authenticateToken, (req, res) => favoriteController.addFavorite(req, res));

/**
 * @route DELETE /api/favorites/:videoId
 * @description Remove a video from user's favorites
 * @header {string} Authorization - Bearer token for authentication
 * @param {string} videoId - Pexels video ID
 * @access Private
 */
router.delete("/:videoId", authenticateToken, (req, res) => favoriteController.removeFavorite(req, res));

/**
 * @route GET /api/favorites
 * @description Get all favorite videos for the authenticated user with full Pexels data
 * @header {string} Authorization - Bearer token for authentication
 * @access Private
 */
router.get("/", authenticateToken, (req, res) => favoriteController.getFavorites(req, res));

/**
 * @route GET /api/favorites/check/:videoId
 * @description Check if a video is in user's favorites
 * @header {string} Authorization - Bearer token for authentication
 * @param {string} videoId - Pexels video ID
 * @access Private
 */
router.get("/check/:videoId", authenticateToken, (req, res) => favoriteController.checkFavorite(req, res));

/**
 * Export the router instance to be mounted in the main routes file.
 */
export default router;
