import mongoose from "mongoose";
import { ApiError } from "../utils/ApiErrors";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {Subscription} from '../models/subscription.model.js'
import {User} from '../models/user.model.js'

const toggleSubsctiption = asyncHandler(async(req,res)=>{

})

// The details of subscribers of own channels
const getUserChannelSubscribers = asyncHandler(async(req,res)=>{

})

// The details of channels that has been subscribed by the user itself.
const getSubscribedChannels = asyncHandler(async(req,res)=>{

})

export {toggleSubsctiption, getUserChannelSubscribers, getSubscribedChannels}


