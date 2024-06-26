import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new  Schema(
    {
        subscriber:{             // who is subscribing       
            type: Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        channel:{               // who is subscribed
            type: Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },    

    },{timestamps:true}
)
export const Subscription = mongoose.model("Subscription",subscriptionSchema)