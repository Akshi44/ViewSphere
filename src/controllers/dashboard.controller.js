import mongoose from "mongoose";
import {ApiError} from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Subscription} from "../models/subscription.model.js";

const getChannelStats = asyncHandler(async (req, res) => {

})

const getChannelVideos = asyncHandler(async (req, res) => {

})

export {
    getChannelStats, 
    getChannelVideos
    }
