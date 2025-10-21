/**
 * Main router configuration for the Zinema API.
 * 
 * Centralizes all route definitions and mounts them under appropriate prefixes.
 * This router is mounted under /api/ in the main application.
 */
import express from "express";
import userRoutes from "./userRoutes";
import videoRoutes from "./videoRoutes";
import favoriteRoutes from "./favoriteRoutes";

/**
 * Express router instance for API routes.
 */
const router = express.Router();

/**
 * Mount user-related routes under /users prefix.
 * 
 * All user endpoints will be accessible at /api/users/*:
 * - POST /api/users/register - User registration
 * - POST /api/users/login - User authentication
 * - GET /api/users/getUser - Get user profile
 * - PUT /api/users/updateUser - Update user profile
 * - DELETE /api/users/deleteUser - Delete user account
 * - POST /api/users/request-password-reset - Request password reset
 * - POST /api/users/reset-password - Reset password with token
 */
router.use("/users", userRoutes);

router.use("/videos", videoRoutes);

router.use("/favorites", favoriteRoutes);

/**
 * Mount favorite-related routes under /favorites prefix.
 * 
 * All favorite endpoints will be accessible at /api/favorites/*:
 * - POST /api/favorites - Add video to favorites
 * - DELETE /api/favorites/:videoId - Remove video from favorites
 * - GET /api/favorites - Get all user favorites with Pexels data
 * - GET /api/favorites/check/:videoId - Check if video is favorited
 */
router.use("/favorites", favoriteRoutes);

/**
 * Export the main router instance.
 * 
 * This router is imported in `app.ts` and mounted under `/api/`,
 * making all routes accessible with the /api/ prefix.
 */
export default router;
