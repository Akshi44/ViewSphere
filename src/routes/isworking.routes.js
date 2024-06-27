import {Router} from "express";
import {isWorking} from "../controllers/like.controller.js"

const router = Router()

router.route("/").get(isWorking);

export default router


