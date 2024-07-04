import {Router} from "express"
import { loginUser, registerUser, logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser, updateAccountDetails,updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory,clearWatchHistory } from "../controllers/user.controller.js"

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/register").post(
    upload.fields([                   //middleware injected before registerUser
        {
            name:"avatar",
            maxCount:1,
        },
        {
            name:"coverImage",
            maxCount:1,
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);

//secure route
// verifyJWT: to check user should be logged in
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken );
router.route("/change-password").post(verifyJWT,changeCurrentPassword );
router.route("/current-user").post(verifyJWT,getCurrentUser);
router.route("/update-account").patch(verifyJWT,updateAccountDetails);     //patch, otherwise all details will update
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar);    //patch, otherwise all details will update
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage); //patch, otherwise all details will update
router.route("/c/:username").get(verifyJWT,getUserChannelProfile); 
router.route("/history").get(verifyJWT,getWatchHistory).delete(verifyJWT,clearWatchHistory); 

export default router

/*
export default router:
Exports the router object directly.
Use, if you only need to export a single entity (the router object).

export default {router}:
Exports an object containing the router object as a property.
Use, if you need to export multiple related entities or anticipate adding more properties to the exported object in the future.

export const router = ..........
Exported router as it is, no changes possible including name changing during import.
*/


/*
import userRoutes from './userRoutes.js':
Imported with desired name only when export was default 

import {router} from './userRoutes.js':
Imported with used name, when export was not default.
syntax of export for this is: export const router = ......
As we used this method to export the models
*/
