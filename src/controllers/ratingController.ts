import { Response } from "express";
import { ratingDAO } from "../dao/ratingDAO";
import { AuthenticatedRequest } from "./videoController";

/**
 * Controller responsible for managing user video ratings.
 * Handles creating, updating, deleting, and retrieving video ratings made by users.
 */
export class RatingController {
  private dao = ratingDAO;

  /**
   * Add a rating to a video for the authenticated user.
   * 
   * @param req - Authenticated request containing user info and rating data (videoId, stars)
   * @param res - Express response
   */
  async rateVideo(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { videoId } = req.params;
      const { stars } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      if (!videoId) {
        return res.status(400).json({ message: "Un id de video es requerida" });
      }

      if (!stars) {
        return res.status(400).json({ message: "Debe proporcionar un valor" });
      }

      // Validate stars are between 1 and 5
      if (stars < 1 || stars > 5) {
        return res.status(400).json({ message: "La calificación debe estar entre 1 y 5 estrellas" });
      }

      const rating = await this.dao.create({ userId, videoId, stars });

      res.status(201).json({
        message: "Video puntuado correctamente",
        rating: {
          id: rating._id,
          videoId: rating.videoId,
          createdAt: rating.createdAt
        }
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Rate video error: " + err.message);
      }
      res.status(500).json({ message: "Error al puntuar video" });
    }
  }

  /**
   * Remove a user's rating from a specific video.
   * 
   * @param req - Authenticated request containing user info and videoId in params
   * @param res - Express response
   */
  async deleteRating(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { videoId } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const rating = await this.dao.findByVideoAndUser(videoId, userId);

      if (!rating) {
        return res.status(404).json({ message: "Puntuación no encontrada" });
      }

      await this.dao.delete(rating._id.toString());

      res.status(200).json({ message: "Puntuación eliminada correctamente" });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Delete rating error: " + err.message);
      }
      res.status(500).json({ message: "Error al eliminar puntuación" });
    }
  }

  /**
   * Retrieve all ratings given by the authenticated user for a specific video.
   * 
   * @param req - Authenticated request containing user info and videoId in params
   * @param res - Express response returning all ratings for that video
   */
  async getRatings(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { videoId } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      // Get ALL ratings for this video (not just for the current user)
      const ratings = await this.dao.findAllByVideo(videoId);

      if (!ratings || ratings.length === 0) {
        return res.status(200).json({ ratings: [], count: 0 });
      }

      // Transform ratings to include user info
      const transformedRatings = ratings.map(rating => ({
        id: rating._id.toString(),
        userId: rating.userId.toString(),
        videoId: rating.videoId,
        stars: rating.stars,
        createdAt: rating.createdAt?.toISOString() || '',
        updatedAt: rating.updatedAt?.toISOString() || ''
      }));

      return res.status(200).json({
        ratings: transformedRatings,
        count: transformedRatings.length
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Get ratings error: " + err.message);
      }
      res.status(500).json({ message: "Error al obtener puntuaciones" });
    }
  }

  /**
   * Update an existing rating's value (stars) by its ID.
   * 
   * @param req - Authenticated request containing user info and ratingId in params
   * @param res - Express response
   */
  async updateRating(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { ratingId } = req.params;
      const { stars } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      if (!ratingId) {
        return res.status(400).json({ message: "Se requiere el ID de la puntuación" });
      }

      if (stars === undefined) {
        return res.status(400).json({ message: "Debe proporcionar un valor para la puntuación" });
      }

      // Validate stars are between 1 and 5
      if (stars < 1 || stars > 5) {
        return res.status(400).json({ message: "La calificación debe estar entre 1 y 5 estrellas" });
      }

      const rating = await this.dao.update(ratingId, stars);

      if (!rating) {
        return res.status(404).json({ message: "Puntuación no encontrada" });
      }

      res.status(200).json({
        message: "Puntuación actualizada correctamente",
        rating: {
          id: rating._id,
          stars: rating.stars,
          updatedAt: rating.updatedAt
        }
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Update rating error: " + err.message);
      }
      res.status(500).json({ message: "Error al actualizar puntuación" });
    }
  }

  /**
   * Check if a video has been rated by the authenticated user.
   * 
   * @param req - Authenticated request containing user info and videoId in params
   * @param res - Express response with isRating boolean and rating data if exists
   */
  async checkRating(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { videoId } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const rating = await this.dao.findByVideoAndUser(videoId, userId);

      if (rating) {
        res.status(200).json({ 
          isRating: true,
          rating: {
            id: rating._id.toString(),
            userId: rating.userId.toString(),
            videoId: rating.videoId,
            stars: rating.stars,
            createdAt: rating.createdAt?.toISOString() || '',
            updatedAt: rating.updatedAt?.toISOString() || ''
          }
        });
      } else {
        res.status(200).json({ isRating: false });
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Check rating error: " + err.message);
      }
      res.status(500).json({ message: "Error al verificar puntuación" });
    }
  }
}

/** 
 * Singleton instance of the RatingController. 
 */
export const ratingController = new RatingController();
