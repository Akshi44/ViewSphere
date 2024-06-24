import mongoose  from "mongoose";
import JsonWebToken from "jsonwebtoken";   // While authentication
import bcrypt from "bcrypt"                // Before password saving
const userSchema = new  mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            lowercase:true,
            unique:true,
            trim:true,
            index:true,                    //to make searchable 
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            unique:true,
            trim:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        avatar:{
            type:String,         //using cloudinary url
            required:true,
        },
        coverImage:{
            type:String,         //using cloudinary url
        },
        password:{
            type:String,
            required:[true,"Password is required"],

        },
        watchHistory:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Video"
            },
        ],
        refreshToken:{
            type:String,
        }

    },{timestamps:true}
)

// BCRYPT 

//Before saving the password, encrypt the password
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next;
    this.password = await bcrypt.hash(this.password,10);        // 10 rounds encryption
    next()
})

// moongoose provides the facility of hooks/Middleware, plugins, methods as well 
// To check the password correction before validate, this method will be used in login page logic to check the correctness of the password
// return true/false
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)                //curr,already saved
}

// JWT 

// Generate access token (web token)
userSchema.methods.generateAccessToken = function(){
    return JsonWebToken.sign(
        {
            //payload
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:ACCESS_TOKEN_EXPIRY
        }
    )
}

// Generate refresh token (web token)
userSchema.methods.generateRefreshToken = async function(){
    return JsonWebToken.sign(
        {
            //payload
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User",userSchema)