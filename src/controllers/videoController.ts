import { Request, Response } from "express";
import { createClient } from "pexels";

/**
 * Extends the standard Express `Request` type to include user information
 * extracted from a verified JWT token.
 */
export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

/**
 * Controller responsible for fetching video data from the Pexels API:
 * popular videos, search by title, and details by ID.
 */
export class VideoController {
  /**
   * Retrieves a paginated list of featured videos from Pexels.
   * Uses different featured categories to get curated content.
   *
   * Requires a valid JWT token (decoded via authentication middleware).
   *
   * @param req - Authenticated request containing `req.params.page`.
   * @param res - Express response returning the video data or an error.
   * @returns JSON object containing featured videos with metadata.
   */
  async getVideos(req: AuthenticatedRequest, res: Response) {
    try {
      const client = createClient(process.env.PEXELS_API_KEY as string);
      const page = Number(req.params.page);

      // Get popular videos (10 per page)
      const popularVideos = await client.videos.popular({ per_page: 10, page: page });

      // Return in the same format as Pexels API
      res.status(200).json({
        page: page,
        per_page: 10,
        total_results: (popularVideos as any).total_results || 0,
        url: (popularVideos as any).url || '',
        videos: (popularVideos as any).videos || []
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Get videos error: " + err.message);
      }
      res.status(500).json({ message: "No se pudo cargar el catálogo" });
    }
  }

  /**
   * Retrieves featured videos from Pexels curated collections.
   * Gets videos from Pexels' featured/editorial sections.
   *
   * Requires a valid JWT token.
   *
   * @param req - Authenticated request containing `req.params.page`.
   * @param res - Express response returning featured videos or an error.
   * @returns JSON object containing featured videos with metadata.
   */
  async getFeaturedVideos(req: AuthenticatedRequest, res: Response) {
    try {
      const client = createClient(process.env.PEXELS_API_KEY as string);
      const page = Number(req.params.page);

      // Get featured videos from popular videos (10 per page)
      const featuredVideos = await client.videos.popular({ per_page: 10, page: page });

      // Return in the same format as Pexels API
      res.status(200).json({
        page: page,
        per_page: 10,
        total_results: (featuredVideos as any).total_results || 0,
        url: (featuredVideos as any).url || '',
        videos: (featuredVideos as any).videos || []
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Get featured videos error: " + err.message);
      }
      res.status(500).json({ message: "No se pudo cargar los videos destacados" });
    }
  }

  /**
   * Searches videos by title with pagination from Pexels.
   *
   * Requires a valid JWT token.
   *
   * @param req - Authenticated request containing `req.params.title` and `req.params.page`.
   * @param res - Express response returning search results or an error.
   * @returns JSON object containing videos matching the title query.
   */
  async getVideoInfoTitle(req: AuthenticatedRequest, res: Response) {
    try {
      const client = createClient(process.env.PEXELS_API_KEY as string);
      const title = req.params.title;
      const page = Number(req.params.page);

      const data = await client.videos.search({ query: title, per_page: 20, page: page });

      res.status(200).json(data);
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Get video info error: " + err.message);
      }

      res.status(500).json({ message: "No se pudo cargar los resultados de búsqueda" });
    }
  }

  /**
   * Retrieves detailed information of a single video by its ID from Pexels.
   *
   * Requires a valid JWT token.
   *
   * @param req - Authenticated request containing `req.params.id`.
   * @param res - Express response returning video details or an error.
   * @returns JSON object containing the video metadata and files.
   */
  async getVideoInfoId(req: AuthenticatedRequest, res: Response) {
    try {
      const client = createClient(process.env.PEXELS_API_KEY as string);
      const id = req.params.id;

      const data = await client.videos.show({ id: id });

      res.status(200).json(data);
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Get video info error: " + err.message);
      }

      res.status(500).json({ message: "No se pudo cargar el video" });
    }
  }
}

/** 
 * Singleton instance of the VideoController. 
*/
export const videoController = new VideoController();
