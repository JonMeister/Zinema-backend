import { Router } from "express";
import { videoController } from "../controllers/videoController";
import { authenticateToken } from "../utils/auth";

const router = Router();

router.get("/page/:page", authenticateToken, (req, res) => videoController.getVideos(req, res));

router.get("/info/title/:title/page/:page", authenticateToken, (req, res) => videoController.getVideoInfoTitle(req, res));

router.get("/info/id/:id", authenticateToken, (req, res) => videoController.getVideoInfoId(req, res));

export default router;
