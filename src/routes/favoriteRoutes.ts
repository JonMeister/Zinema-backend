import { Router } from "express";
import { favoriteController } from "../controllers/favoriteController";
import { authenticateToken } from "../utils/auth";

const router = Router();

/**
 * @route GET /api/favorites/getFavorites
 * @description Get a list of favorited videos.
 * @header {string} Authorization - Bearer token for authentication.
 * @access Private
 */
router.get("/getFavorites", authenticateToken, (req, res) => favoriteController.getFavorites(req, res));

/**
 * @route POST /api/favorites/favorite
 * @description Favorite a video.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {string} videoId - Id of the video to favorite.
 * @access Private
 */
router.post("/favorite", authenticateToken, (req, res) => favoriteController.create(req, res));

/**
 * @route DELETE /api/favorites/unfavorite
 * @description Unfavorite a video.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {string} videoId - ID of the video to unfavorite.
 * @access Private
 */
router.delete("/unfavorite", authenticateToken, (req, res) => favoriteController.delete(req, res));

/**
 * Export the router instance to be mounted in the main routes file.
 */
export default router;
