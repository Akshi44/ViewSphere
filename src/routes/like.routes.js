import {Router} from "express";
import {toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos,
    toggleLike } from "../controllers/like.controller.js"

import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT);

router.route("/").patch(toggleLike);
router.route("/toggle/video/:videoId").patch(toggleVideoLike);
router.route("/toggle/comment/:commentId").patch(toggleCommentLike);
router.route("/toggle/tweet/:tweetId").patch(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router


