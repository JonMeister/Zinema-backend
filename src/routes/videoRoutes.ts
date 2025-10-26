import { Router } from "express";
import { videoController } from "../controllers/videoController";
import { authenticateToken } from "../utils/auth";

const router = Router();

/**
 * @route GET /api/videos/page/:page
 * @description Get a paginated list of featured videos from multiple categories.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {number} page - Page number for pagination.
 * @access Private
 */
router.get("/page/:page", authenticateToken, (req, res) => videoController.getVideos(req, res));

/**
 * @route GET /api/videos/featured/:page
 * @description Get featured videos from Pexels curated collections.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {number} page - Page number for pagination.
 * @access Private
 */
router.get("/featured/:page", authenticateToken, (req, res) => videoController.getFeaturedVideos(req, res));

/**
 * @route GET /api/videos/info/title/:title/page/:page
 * @description Search videos by title with pagination.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {string} title - Video title to search for.
 * @param {number} page - Page number for pagination.
 * @access Private
 */
router.get("/info/title/:title/page/:page", authenticateToken, (req, res) => videoController.getVideoInfoTitle(req, res));

/**
 * @route GET /api/videos/info/id/:id
 * @description Get detailed information of a video by its ID.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {number} id - ID of the video to retrieve.
 * @access Private
 */
router.get("/info/id/:id", authenticateToken, (req, res) => videoController.getVideoInfoId(req, res));

/**
 * Export the router instance to be mounted in the main routes file.
 */
export default router;
