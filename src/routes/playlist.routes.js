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

const router = Router()

router.use(verifyJWT);

router.route("/").post(createPlaylist)

router.route("/:playlistId").get(getPlaylistById).patch(updatePlaylist).delete(deletePlaylist)
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)

router.route("/users/:userId").get(getUserPlaylists)

router.route("user/playlists/:videoId").get(getVideoSavePlaylists)



export default router

