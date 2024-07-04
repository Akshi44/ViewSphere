import { Router } from "express";
import {toggleSubscription, getUserChannelSubscribers, getSubscribedChannels} from '../controllers/subscription.controller.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { userCheck } from "../middlewares/routeAuth.middleware.js";

const router = Router()

// router.use(verifyJWT);

router.route("/:channelId").get(userCheck,getSubscribedChannels).patch(verifyJWT,toggleSubscription)
router.route("/users/:subscriberId").get(userCheck,getUserChannelSubscribers)

export default router

