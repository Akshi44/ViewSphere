import mongoose from "mongoose";
import {ApiError} from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";

const toggleVideoLike = asyncHandler(async(req,res)=>{

})

const toggleCommentLike = asyncHandler(async(req,res)=>{

})

const toggleTweetLike = asyncHandler(async(req,res)=>{

})

const getLikedVideos = asyncHandler(async(req,res)=>{

})

export {toggleVideoLike,
        toggleCommentLike,
        toggleTweetLike,
        getLikedVideos
       }