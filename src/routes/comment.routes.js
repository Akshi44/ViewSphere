import {Router} from "express";
import {getVideoComments,
        addCommentOnVideo,
        updateCommnetOfVideo,
        deleteCommentFromVideo} from "../controllers/comment.controller.js"

import {verifyJWT} from "../middlewares/auth.middleware.js"
import {userCheck} from "../middlewares/routeAuth.middleware.js"

const router = Router()

// router.use(verifyJWT);

router.route("/get/:videoId").get(userCheck,getVideoComments)
router.route("/add/:videoId").post(verifyJWT,addCommentOnVideo);
router.route("/:commentId").delete(verifyJWT,deleteCommentFromVideo).patch(verifyJWT,updateCommnetOfVideo);

export default router
