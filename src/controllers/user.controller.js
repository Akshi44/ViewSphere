import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import {uplaodOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async(req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if users is already exists (email,username)
    // check for images, check for avatar
    // upload them to cloudinary, check for avatar
    // create user object - create entry in DB
    // remove password and refresh token field from response
    // check for user creation
    // return response 

    console.log(req.body)
    // console.log(req.file)
    
    // get user details from frontend
    const {fullname,username,email,password} = req.body
    // console.log("email:",email)
    
    
    // validation - not empty
    // if(fullname===""){
        //     throw new ApiError(400,"fullname is required")
        // }
        
        // or 
    if(
    [fullname,username,email,password]
        .some((field)=>
            field?.trim()===""
        )
    ){
        throw new ApiError(400,"All fields are required")
    }
    
    // check if users is already exists (email,username)
    const existedUser = await User.findOne({
        $or:[ { username }, { email }]
    })
    // console.log(existedUser)
    if(existedUser){
        throw new ApiError(409,"User with this username or email already exists")
    }
    
    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    // console.log(avatarLocalPath)
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    // or 
    let coverImageLocalPath ;
    if(req.file && Array.isArray(req.file.coverImage) && req.file.coverImage.length>0){
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }
    // console.log(coverImageLocalPath)
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    // upload them to cloudinary, check for avatar
    const avatar = await uplaodOnCloudinary(avatarLocalPath)
    const coverImage = await uplaodOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }
    
    // create user object - create entry in DB
    const user = await User.create({
        username : username.toLowerCase(),
        email,
        fullname,
        avatar : avatar.url,
        coverImage:coverImage?.url || "",
        password,
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if(!createdUser){
        throw new ApiError(500,"Something wend wrong while registration")
    }
    
    // return response 
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
    
})

export {registerUser}