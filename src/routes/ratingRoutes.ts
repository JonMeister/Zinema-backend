import { Router } from "express";
import { ratingController } from "../controllers/ratingController";
import { authenticateToken } from "../utils/auth";

const router = Router();

/**
 * @route GET /api/ratings/check/:videoId
 * @description Check whether the authenticated user has rated a specific video.
 * Returns the user's rating if it exists.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {string} videoId - ID of the video to check.
 * @access Private
 * 
 * NOTE: This route MUST come before /:videoId to avoid route conflicts
 */
router.get("/check/:videoId", authenticateToken, (req, res) =>
  ratingController.checkRating(req, res)
);

/**
 * @route POST /api/ratings/:videoId
 * @description Create or update a user's rating for a specific video.
 * If the user has already rated the video, the existing rating is updated.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {string} videoId - ID of the video to rate.
 * @body {number} stars - Rating value (0–10).
 * @access Private
 */
router.post("/:videoId", authenticateToken, (req, res) =>
  ratingController.rateVideo(req, res)
);

/**
 * @route DELETE /api/ratings/:videoId
 * @description Delete a user's rating for a specific video.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {string} videoId - ID of the video whose rating will be deleted.
 * @access Private
 */
router.delete("/:videoId", authenticateToken, (req, res) =>
  ratingController.deleteRating(req, res)
);

/**
 * @route GET /api/ratings/:videoId
 * @description Retrieve all ratings associated with a specific video.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {string} videoId - ID of the video to fetch ratings for.
 * @access Private
 */
router.get("/:videoId", authenticateToken, (req, res) =>
  ratingController.getRatings(req, res)
);

/**
 * @route PUT /api/ratings/:ratingId
 * @description Update the star value of an existing rating.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {string} ratingId - ID of the rating to update.
 * @body {number} stars - New rating value (0–10).
 * @access Private
 */
router.put("/:ratingId", authenticateToken, (req, res) =>
  ratingController.updateRating(req, res)
);

/**
 * Export the router instance to be mounted in the main routes file.
 */
export default router;
