import multer from "multer"


// The disk storage engine gives you full control on storing files to disk that are saved there.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {        // for this middle file multer is used, bcs normal mongoose does not handle file.
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)       // this will return localFilePath, that is used in cloudinary.js
    }
  })
  
export const upload = multer({ storage, })


// Firstly by using this multer files is stored in local server.
// Then by using cloudinary this local file is uploaded to cloudinary.