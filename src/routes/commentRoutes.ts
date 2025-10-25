import { Router } from "express";
import { commentController } from "../controllers/commentController";
import { authenticateToken } from "../utils/auth";

const router = Router();

/**
 * @route POST /api/comments/:videoId
 * @description Create a new comment for a specific video by the authenticated user.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {string} videoId - ID of the video to comment on.
 * @body {string} content - Content of the comment (5–100 characters).
 * @access Private
 */
router.post("/:videoId", authenticateToken, (req, res) =>
  commentController.commentVideo(req, res)
);

/**
 * @route DELETE /api/comments/:commentId
 * @description Delete a comment made by the authenticated user.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {string} commentId - ID of the comment to delete.
 * @access Private
 */
router.delete("/:commentId", authenticateToken, (req, res) =>
  commentController.deleteComment(req, res)
);

/**
 * @route GET /api/comments/:videoId
 * @description Retrieve all comments made by the authenticated user on a specific video.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {string} videoId - ID of the video to retrieve comments for.
 * @access Private
 */
router.get("/:videoId", authenticateToken, (req, res) =>
  commentController.getComments(req, res)
);

/**
 * @route PUT /api/comments/:commentId
 * @description Update the content of an existing comment.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {string} commentId - ID of the comment to update.
 * @body {string} content - Updated comment content (5–100 characters).
 * @access Private
 */
router.put("/:commentId", authenticateToken, (req, res) =>
  commentController.updateComment(req, res)
);

/**
 * @route GET /api/comments/check/:videoId
 * @description Check if the authenticated user has commented on a specific video.
 * Returns `isComment: true` if a comment exists.
 * @header {string} Authorization - Bearer token for authentication.
 * @param {string} videoId - ID of the video to check.
 * @access Private
 */
router.get("/check/:videoId", authenticateToken, (req, res) =>
  commentController.checkComment(req, res)
);

/**
 * Export the router instance to be mounted in the main routes file.
 */
export default router;
