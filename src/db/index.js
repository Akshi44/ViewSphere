import mongoose from "mongoose"
import { DB_NAME } from "../constant.js"

const connectDB =  async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`,)
        console.log(`\n MongoDB connected!! DB host: ${connectionInstance.connection.host}`)
    }
    catch(error){
        console.log("MONGODB connection failed : ",error)
        // throw error
        // or
        process.exit(1)
    }
} 

export default connectDB;