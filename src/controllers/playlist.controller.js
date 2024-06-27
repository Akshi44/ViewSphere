import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import {uplaodOnCloudinary} from '../utils/cloudinary.js'

//create playlist
// add video into playlist
// delete video from playlist
// delete playlist
// get playlist details

const createPlaylist = asyncHandler(async(req,res)=>{
    
})

const getUserPlaylists = asyncHandler(async(req,res)=>{
    
})

const getPlaylistById = asyncHandler(async(req,res)=>{
    
})

const addVideoToPlaylist = asyncHandler(async(req,res)=>{
    
})

const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    
})

const deletePlaylist = asyncHandler(async(req,res)=>{
    
})

const updatePlaylist = asyncHandler(async(req,res)=>{
    
})

export {createPlaylist, 
        getUserPlaylists, 
        getPlaylistById, 
        addVideoToPlaylist, 
        removeVideoFromPlaylist, 
        deletePlaylist, 
        updatePlaylist}




