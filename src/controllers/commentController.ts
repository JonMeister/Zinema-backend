import { Response } from "express";
import { commentDAO } from "../dao/commentDAO";
import { ratingDAO } from "../dao/ratingDAO";
import { userDAO } from "../dao/userDAO";
import { AuthenticatedRequest } from "./videoController";

/**
 * Controller responsible for managing user video comments.
 * Handles creating, deleting, updating, and retrieving comments for videos.
 */
export class CommentController {
  private dao = commentDAO;

  /**
   * Add a comment to a video.
   * 
   * @param req - Authenticated request containing user info, videoId in params, and comment content in body
   * @param res - Express response
   */
  async commentVideo(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { videoId } = req.params;
      const { content } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      if (!videoId) {
        return res.status(400).json({ message: "Un id de video es requerida" });
      }

      if (!content) {
        return res.status(400).json({ message: "No se permiten comentarios vacíos" });
      }

      const comment = await this.dao.create({ userId, videoId, content });

      res.status(201).json({
        message: "Video comentado",
        comment: {
          id: comment._id,
          videoId: comment.videoId,
          createdAt: comment.createdAt
        }
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Comment video error: " + err.message);
      }
      res.status(500).json({ message: "Error al comentar video" });
    }
  }

  /**
   * Delete a user's comment.
   * 
   * @param req - Authenticated request containing user info and commentId in params
   * @param res - Express response
   */
  async deleteComment(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { commentId } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const comment = await this.dao.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comentario no encontrado" });
      }

      await this.dao.delete(comment._id.toString());

      res.status(200).json({ message: "Comentario eliminado" });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Delete comment error: " + err.message);
      }
      res.status(500).json({ message: "Error al eliminar comentario" });
    }
  }

  /**
   * Get all comments for a specific video (from all users).
   * 
   * @param req - Authenticated request containing user info and videoId in params
   * @param res - Express response returning the list of comments
   */
  async getComments(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { videoId } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      // Get ALL comments for this video (from all users)
      const comments = await this.dao.findAllByVideo(videoId);

      if (!comments || comments.length === 0) {
        return res.status(200).json({ comments: [], count: 0 });
      }

      /**
       * Transform comments to include user info and rating.
       * For each comment, fetch the user's firstName directly from the database
       * and include their rating for this video if it exists.
       */
      const transformedComments = await Promise.all(comments.map(async (comment) => {
        // Extract userId from comment (handle both ObjectId and string formats)
        const commentUserId = typeof comment.userId === 'object' && comment.userId !== null 
          ? (comment.userId as any)._id.toString() 
          : comment.userId.toString();
        
        // Get user's rating for this video
        const userRating = await ratingDAO.findByVideoAndUser(videoId, commentUserId);

        /**
         * Fetch user's firstName directly from database using userId.
         * This approach is more reliable than populate for getting user data.
         * Defaults to 'Usuario' if user not found or has no firstName.
         */
        let username = 'Usuario';
        try {
          const user = await userDAO.findById(commentUserId);
          if (user && user.firstName) {
            username = user.firstName;
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }

        return {
          id: comment._id.toString(),
          userId: commentUserId,
          username,
          videoId: comment.videoId,
          content: comment.content,
          rating: userRating ? userRating.stars : null,
          createdAt: comment.createdAt?.toISOString() || '',
          updatedAt: comment.updatedAt?.toISOString() || ''
        };
      }));

      return res.status(200).json({
        comments: transformedComments,
        count: transformedComments.length
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Get comments error: " + err.message);
      }
      res.status(500).json({ message: "Error al obtener comentarios" });
    }
  }

  /**
   * Update an existing comment.
   * 
   * @param req - Authenticated request containing user info, commentId in params, and new content in body
   * @param res - Express response
   */
  async updateComment(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { commentId } = req.params;
      const { content } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      if (!commentId) {
        return res.status(400).json({ message: "Se requiere el ID del comentario" });
      }

      if (!content) {
        return res.status(400).json({ message: "El contenido del comentario no puede estar vacío" });
      }

      const comment = await this.dao.update(commentId, content);

      if (!comment) {
        return res.status(404).json({ message: "Comentario no encontrado" });
      }

      res.status(200).json({
        message: "Comentario actualizado correctamente",
        comment: {
          id: comment._id,
          content: comment.content,
          updatedAt: comment.updatedAt
        }
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Update comment error: " + err.message);
      }
      res.status(500).json({ message: "Error al actualizar comentario" });
    }
  }

  /**
   * Check if the authenticated user has commented on a specific video.
   * 
   * @param req - Authenticated request containing user info and videoId in params
   * @param res - Express response with `isComment` boolean and comment data if exists
   */
  async checkComment(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { videoId } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const comment = await this.dao.findByVideoAndUser(videoId, userId);

      if (comment) {
        // Get user's rating for this video
        const userRating = await ratingDAO.findByVideoAndUser(videoId, userId);

        /**
         * Fetch user's firstName directly from database using userId.
         * This ensures we get the actual user's name for display in the comment.
         * Defaults to 'Usuario' if user not found or has no firstName.
         */
        let username = 'Usuario';
        try {
          const user = await userDAO.findById(userId);
          if (user && user.firstName) {
            username = user.firstName;
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }

        res.status(200).json({ 
          isComment: true,
          comment: {
            id: comment._id.toString(),
            userId: comment.userId.toString(),
            username,
            videoId: comment.videoId,
            content: comment.content,
            rating: userRating ? userRating.stars : null,
            createdAt: comment.createdAt?.toISOString() || '',
            updatedAt: comment.updatedAt?.toISOString() || ''
          }
        });
      } else {
        res.status(200).json({ isComment: false });
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Check comment error: " + err.message);
      }
      res.status(500).json({ message: "Error al verificar comentario" });
    }
  }
}

/** 
 * Singleton instance of the CommentController. 
 */
export const commentController = new CommentController();
