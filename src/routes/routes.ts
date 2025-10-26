/**
 * Main router configuration for the Zinema API.
 * 
 * Centralizes all route definitions and mounts them under appropriate prefixes.
 * This router is mounted under `/api/` in the main application (`app.ts`).
 */

import express from "express";
import userRoutes from "./userRoutes";
import videoRoutes from "./videoRoutes";
import favoriteRoutes from "./favoriteRoutes";
import commentRoutes from "./commentRoutes";
import ratingRoutes from "./ratingRoutes";

/**
 * Express router instance for all API routes.
 */
const router = express.Router();

/**
 * Mount user-related routes under /users prefix.
 * 
 * All user endpoints are accessible at /api/users/*:
 * - POST /api/users/register — Register a new user
 * - POST /api/users/login — Authenticate and return JWT
 * - GET /api/users/getUser — Retrieve user profile
 * - PUT /api/users/updateUser — Update user profile data
 * - DELETE /api/users/deleteUser — Permanently delete account
 * - POST /api/users/request-password-reset — Send reset email
 * - POST /api/users/reset-password — Reset password using token
 */
router.use("/users", userRoutes);

/**
 * Mount video-related routes under /videos prefix.
 * 
 * All video endpoints are accessible at /api/videos/*:
 * - GET /api/videos/page/:page — Get paginated list of featured videos
 * - GET /api/videos/featured/:page — Get featured Pexels videos
 * - GET /api/videos/info/title/:title/page/:page — Search videos by title
 * - GET /api/videos/info/id/:id — Get detailed video info by ID
 */
router.use("/videos", videoRoutes);

/**
 * Mount favorite-related routes under /favorites prefix.
 * 
 * All favorite endpoints are accessible at /api/favorites/*:
 * - POST /api/favorites — Add a video to user's favorites
 * - DELETE /api/favorites/:videoId — Remove video from favorites
 * - GET /api/favorites — Get all favorites with full Pexels data
 * - GET /api/favorites/check/:videoId — Check if video is in favorites
 */
router.use("/favorites", favoriteRoutes);

/**
 * Mount comment-related routes under /comments prefix.
 * 
 * All comment endpoints are accessible at /api/comments/*:
 * - POST /api/comments/:videoId — Add a comment to a video
 * - DELETE /api/comments/:commentId — Delete a user's comment
 * - GET /api/comments/:videoId — Get all comments for a specific video
 * - PUT /api/comments/:commentId — Update a comment's content
 * - GET /api/comments/check/:videoId — Check if user has commented on a video
 */
router.use("/comments", commentRoutes);

/**
 * Mount rating-related routes under /ratings prefix.
 * 
 * All rating endpoints are accessible at /api/ratings/*:
 * - POST /api/ratings/:videoId — Rate a video (0–10 stars)
 * - DELETE /api/ratings/:videoId — Remove user's rating
 * - GET /api/ratings/:videoId — Retrieve all ratings for a video
 * - PUT /api/ratings/:ratingId — Update an existing rating
 * - GET /api/ratings/check/:videoId — Check if user rated a video
 */
router.use("/ratings", ratingRoutes);

/**
 * Export the main router instance.
 * 
 * This router is imported and mounted in `app.ts` under `/api/`,
 * making all routes accessible via `/api/...` URLs.
 */
export default router;
