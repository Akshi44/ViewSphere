import { Router } from "express";
import {toggleSubsctiption, getUserChannelSubscribers, getSubscribedChannels} from '../controllers/tweet.controller.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router = Router()

router.use(verifyJWT);

router.route("/c/:channelId").get(getSubscribedChannels).post(toggleSubsctiption)
router.route("/u/:subscriberId").get(getUserChannelSubscribers)

export default router

