import mongoose  from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new  mongoose.Schema(
    {
        content:{            
            type:String,
            required:true,
        },
        video:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video",
        },
        owner:{                                        //commenter
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    },{timestamps:true}
)
// Add the pagination plugin
commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment",commentSchema)


// plugin is a reusable piece of code that adds additional functionality to a Mongoose schema. Plugins can encapsulate reusable logic, such as adding timestamps, validation, or other custom behaviors to schemas.
// Timestamps Plugin
// Paginate Plugin
// Unique Validator Plugin


// mongoose-aggregate-paginate-v2 is a plugin for Mongoose that simplifies the process of adding pagination to aggregate queries. Aggregation is a powerful tool in MongoDB for data transformation and analysis, and adding pagination to these queries can be quite useful in applications that need to display data in chunks or pages, such as in web applications for lists of videos, users, or other resources as per our requirement.