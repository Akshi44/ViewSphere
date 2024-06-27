import mongoose from "mongoose";
import { ApiError } from "../utils/ApiErrors";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {Tweet} from '../models/tweet.model.js'
import {User} from '../models/user.model.js'

const createTweet = asyncHandler(async(req,res)=>{

})

const updateTweet = asyncHandler(async(req,res)=>{
    
})

const deleteTweet = asyncHandler(async(req,res)=>{
    
})

const getUserTweets = asyncHandler(async(req,res)=>{
    
})

export {createTweet,updateTweet,deleteTweet,getUserTweets}