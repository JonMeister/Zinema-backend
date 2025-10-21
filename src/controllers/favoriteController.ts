import { Request, Response } from "express";
import { favoriteDAO } from "../dao/favoriteDAO";

/**
 * Extends the standard Express `Request` type to include user information
 * extracted from a verified JWT token.
 */
export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

/**
 * Controller responsible for managing user favorites.
 *
 * Handles creation, retrieval, and deletion of favorite videos
 * for authenticated users.
 */
export class FavoriteController {
  /**
   * Marks a video as a favorite for the authenticated user.
   *
   * Validates that both `userId` and `videoId` are provided.
   * If the favorite already exists, a 409 conflict is returned.
   *
   * @param req - Authenticated request containing `videoId` in the body and `req.user.id` from the token.
   * @param res - Express response used to send success or error messages.
   * @returns A JSON object containing the new favorite's ID if successful.
   */
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { videoId } = req.body;
      const userId = req.user!.id;

      if (!userId || !videoId) {
        res.status(400).json({ message: "Todos los campos son requeridos" });
        return;
      }

      const favorite = await favoriteDAO.create({ userId, videoId });

      res.status(200).json({ favoriteId: favorite._id });
    } catch (err: any) {
      if (err.code === 11000) {
        res.status(409).json({ message: "Video ya marcado como favorito" });
      } else if (err.name === "ValidationError") {
        res.status(400).json({ message: err.message });
      } else {
        if (process.env.NODE_ENV === "development") {
          console.log("Create favorite error:", err.message);
        }
        res.status(500).json({ message: "Error interno del servidor" });
      }
    }
  }

  /**
   * Retrieves all videos marked as favorites by the authenticated user.
   *
   * Uses the user ID from the verified token to query the database.
   *
   * @param req - Authenticated request containing `req.user.id`.
   * @param res - Express response used to return the list of favorites.
   * @returns An array of favorite documents belonging to the user.
   */
  async getFavorites(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const data = await favoriteDAO.findByUserId(userId);

      res.status(200).json(data);
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.log("Get favorites error:", err.message);
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  /**
   * Removes a video from the authenticated user's favorites.
   *
   * Verifies that the favorite exists before attempting deletion.
   * If no favorite is found, returns a 404 error.
   *
   * @param req - Authenticated request containing `videoId` in the body.
   * @param res - Express response confirming deletion or returning an error.
   * @returns A confirmation message upon successful deletion.
   */
  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { videoId } = req.body;
      const userId = req.user!.id;

      const favorite = await favoriteDAO.findByVideoAndUser(videoId, userId);

      if (!favorite) {
        res.status(404).json({ message: "El video no ha sido marcado como favorito" });
        return;
      }

      await favoriteDAO.delete(favorite._id.toString());

      res.status(200).json({ message: "Video quitado de favoritos" });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.log("Delete favorite error:", err.message);
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

/** Singleton instance of the FavoriteController. */
export const favoriteController = new FavoriteController();
