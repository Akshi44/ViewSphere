import mongoose from "mongoose";
import {ApiError} from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.midel.js";

const getVideoComments = asyncHandler(async(req,res)=>{

})

const addCommentOnVideo = asyncHandler(async(req,res)=>{

})

const updateCommnetOfVideo = asyncHandler(async(req,res)=>{
    
})

const deleteCommentFromVideo = asyncHandler(async(req,res)=>{
    
})

export {getVideoComments,
    addCommentOnVideo,
    updateCommnetOfVideo,
    deleteCommentFromVideo
}