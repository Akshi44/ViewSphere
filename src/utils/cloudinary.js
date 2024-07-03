import {v2 as cloudinary} from "cloudinary"
import fs from "fs"                       // file system 

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
        const response = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto",folder: "ViewSphere/photos"})
        // File has been uploaded successfully
        console.log("File has been uploaded successfully")
        // console.log(response)
        // console.log(response.url)

        // Removing File From Local directory, just after the File Uploaded Successfully on cloudinary
        fs.unlinkSync(localFilePath)
        return response
    }catch(error){
        // File is not uploaded on server, but fetched in  local server, hence this will create unecessary load on local server, so unlink(remove) the file from local server and return fail message 
        fs.unlinkSync(localFilePath)
        console.log(`File does not uploaded : ${error}`)
        return null
    }
}

const uplaodVideoOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto",folder: "ViewSphere/videos"})
        // File has been uploaded successfully
        console.log("File has been uploaded successfully")
        // console.log(response)
        // console.log(response.url)

        // Removing File From Local directory, just after the File Uploaded Successfully on cloudinary
        fs.unlinkSync(localFilePath)
        return response
        
    } catch (error) {
        // File is not uploaded on server, but fetched in  local server, hence this will create unecessary load on local server, so unlink(remove) the file from local server and return fail message 
        fs.unlinkSync(localFilePath)
        console.log(`File does not uploaded : ${error}`)
        return null
    }
}

const deleteFromCloudinary = async(imageUrl)=>{
    try {
        if(!imageUrl){
            return false;
        }

        // matches[0]: The entire matched string.
        // matches[1]: The first capturing group (photos|videos).
        // matches[2]: The second capturing group (.+?), which captures the publicId of the image or video.

        let imageId = imageUrl.match(
            /(?:image|video)\/upload\/v\d+\/ViewSphere\/(photos|videos)\/(.+?)\.\w+$/
        )[2];
        // console.log(imageId)

        const response = await cloudinary.uploader.destroy(`ViewSphere/photos/${imageId}`,{resource_type:"image"});
        return response ; 

    } catch (error) {
        console.log("Error occured while deleting the image from cloudinary", error)
        return false;
    }
}
const deleteVideoFromCloudinary = async(videoUrl)=>{
    try {
        if(!videoUrl){
            return false;
        }

        // matches[0]: The entire matched string.
        // matches[1]: The first capturing group (photos|videos).
        // matches[2]: The second capturing group (.+?), which captures the publicId of the image or video.

        let videoId = videoUrl.match(
            /(?:image|video)\/upload\/v\d+\/ViewSphere\/(photos|videos)\/(.+?)\.\w+$/
        )[2];
        // console.log(videoId)

        const response = await cloudinary.uploader.destroy(`ViewSphere/videos/${videoId}`,{resource_type:"video"});
        return response ; 

    } catch (error) {
        console.log("Error occured while deleting the video from cloudinary", error)
        return false;
    }
}

export {
    uplaodOnCloudinary,
    uplaodVideoOnCloudinary,
    deleteFromCloudinary,
    deleteVideoFromCloudinary
}