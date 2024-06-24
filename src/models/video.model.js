import mongoose  from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new  mongoose.Schema(
    {
        videoFile:{              //using cloudinary url
            type:String,
            required:true,
        },
        thumbnail:{
            type:String,
            required:true,
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        duration:{             //using cloudinary url
            type:Number,
            required:true,
        },
        views:{
            type:Number,
            default:0,
            required:true,
        },
        isPublished:{
            type:Boolean,
            default:true,
        }
        

    },{timestamps:true}
)
// Add the pagination plugin
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)


// plugin is a reusable piece of code that adds additional functionality to a Mongoose schema. Plugins can encapsulate reusable logic, such as adding timestamps, validation, or other custom behaviors to schemas.
// Timestamps Plugin
// Paginate Plugin
// Unique Validator Plugin


// mongoose-aggregate-paginate-v2 is a plugin for Mongoose that simplifies the process of adding pagination to aggregate queries. Aggregation is a powerful tool in MongoDB for data transformation and analysis, and adding pagination to these queries can be quite useful in applications that need to display data in chunks or pages, such as in web applications for lists of videos, users, or other resources as per our requirement.