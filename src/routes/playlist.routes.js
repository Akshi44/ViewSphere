import { Router } from "express";
import {createPlaylist, 
    getUserPlaylists, 
    addVideoToPlaylist, 
    removeVideoFromPlaylist, 
    getPlaylistById, 
    deletePlaylist, 
    updatePlaylist,
    getVideoSavePlaylists} from '../controllers/playlist.controller.js'

import {verifyJWT} from '../middlewares/auth.middleware.js'
import { userCheck } from "../middlewares/routeAuth.middleware.js";

const router = Router()

// router.use(verifyJWT);

router.route("/").post(verifyJWT,createPlaylist)

router.route("/add/:playlistId/:videoId").patch(verifyJWT,addVideoToPlaylist)

router.route("/remove/:playlistId/:videoId").patch(verifyJWT,removeVideoFromPlaylist)

router.route("/:playlistId").get(userCheck,getPlaylistById).patch(verifyJWT,updatePlaylist).delete(verifyJWT,deletePlaylist)

router.route("/users/:userId").get(userCheck,getUserPlaylists)

router.route("user/playlists/:videoId").get(verifyJWT,getVideoSavePlaylists)



export default router

