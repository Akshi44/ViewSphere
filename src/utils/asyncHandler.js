// Created wrapper function as the utility function


// method-1
const asyncHandler = (requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
    }
}
export {asyncHandler}


// method-2
/* 
// Higher order function 
const asyncHandler=(fn)=>async(req,res,next)=>{
    try{
        await fn(req,res,next)
    }catch(error){
        res.status(error.code || 500).json({
            success:false,
            message:error.message
        })
    }
} 
export {asyncHandler}

*/