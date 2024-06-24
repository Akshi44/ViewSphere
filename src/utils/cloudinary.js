import {v2 as cloudinary} from "cloudinary"
import fs from  fs                       // file system 

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_CLOUD_KEY, 
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET ,
});

const uplaodOnCloudinary = async (localFilePath)=>{
    try{
        if(!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
        // File has been uploaded successfully
        console.log("File has been uploaded successfully")
        console.log(response)
        console.log(response.url)
        return response
    }catch(error){
        // File is not uploaded on server, but fetched in  local server, hence this will create unecessary load on local server, so unlink(remove) the file from local server and return fail message 
        fs.unlinkSync(localFilePath)
        console.log(`File does not uploaded : ${error}`)
        return null
    }
}

export {uplaodOnCloudinary}