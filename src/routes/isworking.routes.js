import {Router} from "express";
import {isWorking} from "../controllers/isworking.controller.js"

const router = Router()

router.route("/").get(isWorking);

export default router


