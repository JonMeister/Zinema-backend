import { Response } from "express";
import { Favorite } from "../models/favoriteModel";
import { AuthenticatedRequest } from "./videoController";
import { createClient } from "pexels";

/**
 * Controller responsible for managing user favorite videos.
 * Handles adding, removing, and retrieving favorite videos with their details from Pexels.
 */
export class FavoriteController {
  /**
   * Add a video to user's favorites.
   * 
   * @param req - Authenticated request containing user info and videoId in body
   * @param res - Express response
   */
  async addFavorite(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { videoId } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      if (!videoId) {
        return res.status(400).json({ message: "videoId es requerido" });
      }

      // Check if already exists
      const existingFavorite = await Favorite.findOne({ userId, videoId });
      if (existingFavorite) {
        return res.status(400).json({ message: "Video ya está en favoritos" });
      }

      // Create new favorite
      const favorite = new Favorite({ userId, videoId });
      await favorite.save();

      res.status(201).json({ 
        message: "Video agregado a favoritos",
        favorite: {
          id: favorite._id,
          videoId: favorite.videoId,
          createdAt: favorite.createdAt
        }
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Add favorite error: " + err.message);
      }
      res.status(500).json({ message: "Error al agregar a favoritos" });
    }
  }

  /**
   * Remove a video from user's favorites.
   * 
   * @param req - Authenticated request containing user info and videoId in params
   * @param res - Express response
   */
  async removeFavorite(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { videoId } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const result = await Favorite.findOneAndDelete({ userId, videoId });

      if (!result) {
        return res.status(404).json({ message: "Favorito no encontrado" });
      }

      res.status(200).json({ message: "Video eliminado de favoritos" });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Remove favorite error: " + err.message);
      }
      res.status(500).json({ message: "Error al eliminar de favoritos" });
    }
  }

  /**
   * Get all favorite videos for the authenticated user with their full details from Pexels.
   * 
   * @param req - Authenticated request containing user info
   * @param res - Express response returning favorite videos with Pexels data
   */
  async getFavorites(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      // Get all favorite video IDs for this user
      const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });

      if (favorites.length === 0) {
        return res.status(200).json({ videos: [], count: 0 });
      }

      // Fetch video details from Pexels API using existing getVideoInfoId logic
      const client = createClient(process.env.PEXELS_API_KEY as string);
      const videoDetailsPromises = favorites.map(async (fav) => {
        try {
          const videoData = await client.videos.show({ id: fav.videoId });
          return videoData;
        } catch (error) {
          console.error(`Error fetching video ${fav.videoId}:`, error);
          return null;
        }
      });

      const videoDetails = await Promise.all(videoDetailsPromises);
      
      // Filter out any null values (videos that couldn't be fetched)
      const validVideos = videoDetails.filter(video => video !== null);

      res.status(200).json({
        videos: validVideos,
        count: validVideos.length
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Get favorites error: " + err.message);
      }
      res.status(500).json({ message: "Error al obtener favoritos" });
    }
  }

  /**
   * Check if a video is in user's favorites.
   * 
   * @param req - Authenticated request containing user info and videoId in params
   * @param res - Express response with isFavorite boolean
   */
  async checkFavorite(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { videoId } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const favorite = await Favorite.findOne({ userId, videoId });

      res.status(200).json({ isFavorite: !!favorite });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Check favorite error: " + err.message);
      }
      res.status(500).json({ message: "Error al verificar favorito" });
    }
  }
}

/** 
 * Singleton instance of the FavoriteController. 
 */
export const favoriteController = new FavoriteController();
