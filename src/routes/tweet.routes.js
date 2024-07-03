import { Router } from "express";
import {createTweet,
    updateTweet,
    deleteTweet,
    getUserTweets,
    getAllUserFeedTweets,
    getAllTweets
} from '../controllers/tweet.controller.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { userCheck } from "../middlewares/routeAuth.middleware.js";

const router = Router()

// router.use(verifyJWT);

router.route("/feed").get(userCheck,getAllUserFeedTweets);
router.route("/").get(userCheck,getAllTweets).post(verifyJWT,createTweet);
router.route("/users/:userId").get(userCheck,getUserTweets)
router.route("/:tweetId").patch(verifyJWT,updateTweet).delete(verifyJWT,deleteTweet)

export default router

