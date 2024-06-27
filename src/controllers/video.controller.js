import mongoose from "mongoose";
import { ApiError } from "../utils/ApiErrors";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uplaodOnCloudinary } from "../utils/cloudinary";
import {Video} from '../models/video.model.js'
import {User} from '../models/user.model.js'



const getAllVideos = asyncHandler(async(req,res)=>{

})

const publishVideo = asyncHandler(async(req,res)=>{

})

const getVideoById = asyncHandler(async(req,res)=>{

})

const updateVideo = asyncHandler(async(req,res)=>{

})

const deleteVideo = asyncHandler(async(req,res)=>{

})

const togglePublishStatus = asyncHandler(async(req,res)=>{

})

export {getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
    }