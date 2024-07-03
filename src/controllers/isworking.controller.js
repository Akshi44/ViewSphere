import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isWorking = asyncHandler(async(req,res)=>{
    return res
            .status(200)
            .json(new ApiResponse(200,"It's working successfully"))
})

export{isWorking}