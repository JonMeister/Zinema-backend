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
   * Retrieves a paginated list of popular videos from Pexels.
   *
   * Requires a valid JWT token (decoded via authentication middleware).
   *
   * @param req - Authenticated request containing `req.params.page`.
   * @param res - Express response returning the video data or an error.
   * @returns JSON object containing popular videos with metadata.
   */
  async getVideos(req: AuthenticatedRequest, res: Response) {
    try {
      const client = createClient(process.env.PEXELS_API_KEY as string);
      const page = Number(req.params.page);

      const data = await client.videos.popular({ per_page: 3, page: page });

      res.status(200).json(data);
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Get videos error: " + err.message);
      }
      res.status(500).json({ message: "No se pudo cargar el catálogo" });
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

      const data = await client.videos.search({ query: title, per_page: 3, page: page });

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
