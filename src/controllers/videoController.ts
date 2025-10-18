import { Request, Response } from "express";
import { createClient } from "pexels";

/**
 * Extends the standard Express `Request` type to include user information
 * extracted from a verified JWT token.
 */
export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

export class VideoController {
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

  async getVideoInfoTitle(req: AuthenticatedRequest, res: Response) {
    try {
      const client = createClient(process.env.PEXELS_API_KEY as string);

      const title = req.params.title;
      const page = Number(req.params.page);

      const data = await client.videos.search({ query: title, per_page: 3, page: page});

      res.status(200).json(data);
    } catch (err: any) {
      if (process.env.NODE_ENV === "development") {
        console.error("Get video info error: " + err.message);
      }

      res.status(500).json({ message: "No se pudo cargar el video" });
    }
  }

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

export const videoController = new VideoController();
