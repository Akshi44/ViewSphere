import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import {uplaodOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

//method for access and refresh token
const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        // console.log(user)
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken()
        console.log(accessToken)
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

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

const loginUser = asyncHandler(async(req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if users (email or username) find in database
    // if users does not find in database, (user does not exist, create account)
    // if users found in database, check if body password is same with the password of above user 
    // access and refresh token
    // send cookies
    // return response 
   
    // get user details from frontend
    const {username,email,password}=req.body

    // validation - not empty
    // check if users (email or username) find in database
    // if(!(username || email)){
    //     throw new ApiError(400,"username or email is required")
    // }
    // or 
    if(!username && !email){
        throw new ApiError(400, "Username or email is required");
    }
    
    // if users does not find in database, (user does not exist, create account)
    const user = await User.findOne({
        $or:[ { username }, { email }]
    })
    if(!user){
        throw new ApiError(400,"User does not exists, create account first")
    }
    
    // if users found in database, check if body password is same with the password of above user 
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credential")
    }
    // console.log(isPasswordValid);

    // access and refresh token
    const {accessToken,refreshToken}= await generateAccessAndRefereshTokens(user._id)

    // variable user has blank refreshToken, bcs generateAccessAndRefreshToken was run after the defination of user, so either update the user's refreshToken or run query again to find user with given id, now this user will have accessToken and refreshToekn as well.
    const loggedInUser = await User.findOne(user._id).select("-password -refreshToken")
    
    // send cookies :  Cookies are commonly used to maintain session state and store user-specific information securely on the client side
    //  httpOnly:true, secure:true mean cookies are updatable only by server not by client. mean secure
    const options={
        httpOnly:true,   // This instructs the browser that this cookie should not be accessible via client-side JavaScript.
        secure:true,     // you indicate to the browser that the cookie should only be sent over HTTPS connections.
    }

    // return response 
    return res.status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)
            .json(
                new ApiResponse(200,
                    {
                    user:loggedInUser,accessToken,refreshToken
                    },
                    "User logged In Successfully"
                )
            )
})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,                    // req.user was access, through auth.middleware.js/verifyJWT . we required bcs while logout user does not give form-data, so we access the data from cookies.
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new :true
        }
    )

    const options={
        httpOnly:true,   // This instructs the browser that this cookie should not be accessible via client-side JavaScript.
        secure:true,     // you indicate to the browser that the cookie should only be sent over HTTPS connections.
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out !"))
})

const refereshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorised Request")
    }
    
    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        
        const user = await User.findById(decodedToken?._id)
        
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token")
        }
    
        if(incomingRefreshToken!== user?.refreshToken){
            throw new ApiError(401,"Refresh Token is expired or used.")
        }
    
        const options={
            httpOnly:true,   // This instructs the browser that this cookie should not be accessible via client-side JavaScript.
            secure:true,     // you indicate to the browser that the cookie should only be sent over HTTPS connections.
        }
    
        const {accessToken,newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
        return res
            .status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",newRefreshToken,options)
            .json(
                new ApiResponse(
                    200,
                    {accessToken,refreshToken:newRefreshToken},
                    "Access Token Refreshed Successfull"
                )
            )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Refresh Token")
    }
 
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body
    if(oldPassword==newPassword){
        throw new ApiError (400,"newPassword can not be same as oldpassword")
    }
    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)  
    
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
    }

    user.password=user.newPassword
    await user.save({validateBeforeSave:false})

    return res
        .status(200)
        .json(new ApiResponse(200,{},"Password Updated Succesfully!"))

})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
            .status(200)
            .json(new ApiResponse(200,req.user,"Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullname,username,email} = req.body

    if(!fullname || !email || !username){
        throw new ApiError(400,"All fields are required")
    }

    const user = User.findByIdAndUpdate(req.user?._id,{$set:{fullname:fullname,email,username}},{new:true}).select("-password -refreshToken")

    return res
        .status(200)
        .json(new ApiError(200,user,"Account details updated successfully"))

})

const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarlocalPath = req.file?.path

    if(!avatarlocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar = await uplaodOnCloudinary(avatarlocalPath)   // return a complete object

    if(!avatar.url){
        throw new ApiError(400,"Error while uplaoding the Avatar")
    }

    const user = await User.findByIdAndUpdate(req.user._id,{$set:{avatar:avatar.url}},{new:true}).select("-password -refreshToken")

    return res
            .status(200)
            .json(new ApiResponse(200,user,"Avatar image updated successfully"))
})

const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImagelocalPath = req.file?.path

    if(!coverImagelocalPath){
        throw new ApiError(400,"CoverImage file is missing")
    }

    const coverImage= await uplaodOnCloudinary(coverImagelocalPath)   // return a complete object

    if(!coverImage.url){
        throw new ApiError(400,"Error while uplaoding the coverImage")
    }

    const user = await User.findByIdAndUpdate(req.user._id,{$set:{coverImage:coverImage.url}},{new:true}).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"coverImage updated successfully"))    
})

export {registerUser,loginUser , logoutUser,refereshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage }