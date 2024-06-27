import {Router} from "express";
import {getVideoComments,
        addCommentOnVideo,
        updateCommnetOfVideo,
        deleteCommentFromVideo} from "../controllers/like.controller.js"

import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT);

router.route("/:videoId").get(getVideoComments).post(addCommentOnVideo);
router.route("/c/commentId").delete(deleteCommentFromVideo).patch(updateCommnetOfVideo);

export default router
