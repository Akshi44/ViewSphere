import { Router } from "express";
import {  
    getAllVideosByOption,
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    updateViewOfVideo
} from '../controllers/video.controller.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {upload} from "../middlewares/multer.middleware.js"
import {userCheck} from "../middlewares/routeAuth.middleware.js"
import {abortedCheck} from "../middlewares/abortedCheck.middleware.js"

const router = Router()

// router.use(verifyJWT);

router.route("/all/option").get(getAllVideosByOption);

router.route("/").get(getAllVideos)
        .post(
            verifyJWT,
            upload.fields([
                {
                    name:"videoFile",
                    maxCount:1,
                },
                {
                    name:"thumbnail",
                    maxCount:1,
                },
            ]),
        abortedCheck,
        publishVideo);

router.route("/:videoId").get(userCheck,getVideoById).delete(verifyJWT,deleteVideo).patch(verifyJWT,upload.single("thumbnail"),updateVideo)

router.route("/toggle/publish/:videoId").patch(verifyJWT,togglePublishStatus)

router.route("/view/:videoId").patch(userCheck,updateViewOfVideo)

export default router
