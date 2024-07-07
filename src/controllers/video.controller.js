import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import {
  uplaodOnCloudinary,
  uplaodVideoOnCloudinary,
  deleteFromCloudinary,
  deleteVideoFromCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Playlist } from "../models/playlist.model.js";

const getAllVideosByOption = asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy,
      sortType = "video",
      order,
      userId,
    } = req.query;
  
    // filter video by given filters
    let filters = { isPublished: true };
    if (isValidObjectId(userId))
      filters.owner = new mongoose.Types.ObjectId(userId);
  
    let pipeline = [
      {
        $match: {
          ...filters,
        },
      },
    ];
  
    const sort = {};
  
    // if query is given filter the videos
    if (search) {
      const queryWords = search
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .split(" ");
      const filteredWords = queryWords.filter(
        (word) => !stopWords.includes(word)
      );
  
      console.log("search: ", search);
      console.log("filteredWords: ", filteredWords);
  
      pipeline.push({
        $addFields: {
          titleMatchWordCount: {
            $size: {
              $filter: {
                input: filteredWords,
                as: "word",
                cond: {
                  $in: ["$$word", { $split: [{ $toLower: "$title" }, " "] }],
                },
              },
            },
          },
        },
      });
  
      pipeline.push({
        $addFields: {
          descriptionMatchWordCount: {
            $size: {
              $filter: {
                input: filteredWords,
                as: "word",
                cond: {
                  $in: [
                    "$$word",
                    { $split: [{ $toLower: "$description" }, " "] },
                  ],
                },
              },
            },
          },
        },
      });
  
      sort.titleMatchWordCount = -1;
    }
  
    // sort the documents
    if (sortBy) {
      sort[sortBy] = parseInt(order);
    } else if (!search && !sortBy) {
      sort["createdAt"] = -1;
    }
  
    pipeline.push({
      $sort: {
        ...sort,
      },
    });
  
    // fetch owner detail
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                fullname: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$owner",
      }
    );
  
    // pipeline.push({
    //   $project: {
    //     title: 1,
    //     description: 1,
    //     createdAt: 1,
    //     titleMatchWordCount: 1,
    //     descriptionMatchWordCount: 1,
    //     owner: 1,
    //   },
    // });
  
    // console.log("pipeline: ",pipeline);
    const videoAggregate = Video.aggregate(pipeline);
  
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
  
    const allVideos = await Video.aggregatePaginate(videoAggregate, options);
  
    const { docs, ...pagingInfo } = allVideos;
  
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { videos: docs, pagingInfo },
          "All Query Videos Sent Successfully"
        )
      );
  });
  
const getAllVideos = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  let filters = { isPublished: true };
  if (isValidObjectId(userId))
    filters.owner = new mongoose.Types.ObjectId(userId);
  let pipeline = [
    {
      $match: {
        ...filters,
      },
    },
  ];
  pipeline.push({
    $sort: {
      createdAt: -1,
    },
  });

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    }
  );

  const allVideos = await Video.aggregate(Array.from(pipeline));

  return res
    .status(200)
    .json(new ApiResponse(200, allVideos, "all videos sent"));
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  let videolocalPath = null;
  if (req.files && req.files.videoFile && req.files.videoFile.length > 0) {
    videolocalPath = req.files?.videoFile[0].path;
  }
  if (!videolocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  let thumbnaillocalPath = null;
  if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
    thumbnaillocalPath = req.files?.thumbnail[0].path;
  }
  if (!thumbnaillocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  // check if connection closed then abort operations else continue
  if (req.customConnectionClosed) {
    console.log("Connection closed, aborting video and thumbnail upload");
    console.log("All resources Cleaned up & request closed");
    return; // stop further execution
  }

  // Upload video to Cloudinary
  const videoUploadResult = await uplaodVideoOnCloudinary(videolocalPath);
  if (!videoUploadResult.url) {
    throw new ApiError(500, "Error while uploading the video file");
  }

  // check if connection closed then delete video and abort operations else continue
  if (req.customConnectionClosed) {
    console.log(
      "Connection closed, deleting video and thumbnail and abort operation"
    );
    await deleteVideoFromCloudinary(videoUploadResult.url);
    fs.unlinkSync(thumbnaillocalPath);
    console.log("All resources Cleaned up & request closed");
    return; // stop further execution
  }
  // Upload thumbnail to Cloudinary
  const thumbnailUploadResult = await uplaodOnCloudinary(thumbnaillocalPath);
  if (!thumbnailUploadResult.url) {
    throw new ApiError(500, "Error while uploading the thumbnail");
  }
  if (req.customConnectionClosed) {
    console.log(
      "Connection closed, deleting video & thumbnail and aborting db operation"
    );
    await deleteVideoFromCloudinary(videoUploadResult.url);
    await deleteFromCloudinary(thumbnailUploadResult.url);
    console.log("All resources Cleaned up & request closed...");
    return; // Preventing further execution
  }

  // Create video document
  const video = await Video.create({
    videoFile: videoUploadResult.url,
    thumbnail: thumbnailUploadResult.url,
    owner: req.user._id,
    title,
    description,
    duration: videoUploadResult.duration, // assuming duration is returned from cloudinary upload
  });
  if (!video) {
    throw new ApiError(500, "Error while Publishing Video");
  }
  // check if connection closed then delete video & thumbnail & dbEntry and abort response else continue
  if (req.customConnectionClosed) {
    console.log(
      "Connection closed!!! deleting video & thumbnail & dbEntry and aborting response..."
    );
    await deleteVideoFromCloudinary(videoUploadResult.url);
    await deleteFromCloudinary(thumbnailUploadResult.url);
    let video = await Video.findByIdAndDelete(video._id);
    console.log("Deleted the Video from db: ", video);
    console.log("All resources Cleaned up & request closed");
    return;
  }

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
        isPublished: true,
      },
    },
    // get all likes array
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
        pipeline: [
          {
            $match: {
              liked: true,
            },
          },
          {
            $group: {
              _id: "$liked",
              likeOwners: { $push: "$likedBy" },
            },
          },
        ],
      },
    },
    // get all dislikes array
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "dislikes",
        pipeline: [
          {
            $match: {
              liked: false,
            },
          },
          {
            $group: {
              _id: "$liked",
              dislikeOwners: { $push: "$likedBy" },
            },
          },
        ],
      },
    },
    // adjust shapes of likes and dislikes
    {
      $addFields: {
        likes: {
          $cond: {
            if: {
              $gt: [{ $size: "$likes" }, 0],
            },
            then: { $first: "$likes.likeOwners" },
            else: [],
          },
        },
        dislikes: {
          $cond: {
            if: {
              $gt: [{ $size: "$dislikes" }, 0],
            },
            then: { $first: "$dislikes.dislikeOwners" },
            else: [],
          },
        },
      },
    },
    // fetch owner details
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    // added like fields
    {
      $project: {
        videoFile: 1,
        title: 1,
        description: 1,
        duration: 1,
        thumbnail: 1,
        views: 1,
        owner: 1,
        createdAt: 1,
        updatedAt: 1,
        totalLikes: {
          $size: "$likes",
        },
        totalDisLikes: {
          $size: "$dislikes",
        },
        isLiked: {
          $cond: {
            if: {
              $in: [req.user?._id, "$likes"],
            },
            then: true,
            else: false,
          },
        },
        isDisLiked: {
          $cond: {
            if: {
              $in: [req.user?._id, "$dislikes"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  if (!video.length > 0) throw new ApiError(400, "No video found");

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video Fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const thumbnaillocalPath = req.file?.path; //Give data in body->row->form-data formate

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Video ID is not valid");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video is not available");
  }
  if (!title && !description && !thumbnaillocalPath) {
    throw new ApiError(
      400,
      " Atleast one field is required to update the video"
    );
  }

  // check for the updation validity of the user
  if (video.owner.toString() != req.user._id.toString()) {
    throw new ApiError(403, "You do not have permission to update this video");
  }

  let thumbnail;
  if (thumbnaillocalPath) {
    thumbnail = await uplaodOnCloudinary(thumbnaillocalPath); // return a complete object

    if (!thumbnail.url) {
      throw new ApiError(400, "Error while uplaoding the Avatar");
    }
    // To reduce traffic from cloudinary, delete current thumbnail
    await deleteFromCloudinary(video.thumbnail);
  }

  if (title) video.title = title;
  if (description) video.description = description;
  if (thumbnail) video.thumbnail = thumbnail.url;
  // or
  // await Video.findByIdAndUpdate(videoId,{$set:{thumbnail:thumbnail.url}},{new:true}).select("-password -refreshToken")

  const updatedVideo = await video.save({ validateBeforeSave: false });

  if (!updateVideo) {
    throw new ApiError(
      500,
      "Video updation failed, cause of server side error"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  // find videoId
  // fetch video successfully by using id
  // delete video from cloudinary
  // delete video likes
  // find video comments
  // delete comment likes
  // delete comments
  // delete that video from playlist
  // return ApiResponse

  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "This videoId not found");
  }
  const deleteVideo = await Video.findByIdAndDelete(videoId);
  if (!deleteVideo) {
    throw new ApiError(400, "Video not found");
  }
  // delete video from cloudinary
  await deleteVideoFromCloudinary(deleteVideo.videoFile);

  const deleteVideoLikes = await Like.deleteMany({
    video: new mongoose.Types.ObjectId(videoId),
  });

  const videoComments = await Comment.find({
    video: new mongoose.Types.ObjectId(videoId),
  });
  const commentIds = videoComments.map((comment) => comment._id);

  const deleteCommentLikes = await Like.deleteMany({
    comment: { $in: commentIds },
  });

  const deleteVideoComments = await Comment.deleteMany({
    video: new mongoose.Types.ObjectId(videoId),
  });

  const deleteVideoFromPlaylist = await Playlist.updateMany(
    {},
    { $pull: { videos: new mongoose.Types.ObjectId(videoId) } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video is not available");
  }

  video.isPublished = !video.isPublished;
  const updatedVideo = await video.save();

  if (!updatedVideo) {
    throw new ApiError(403, "You do not have permission to update this video");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: updatedVideo.isPublished },
        "Video publish status updated successfully"
      )
    );
});

const updateViewOfVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) throw new ApiError(400, "videoId required");
  
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(400, "Video not found");
  
    video.views += 1;
    const updatedVideo = await video.save();
    if (!updatedVideo) throw new ApiError(400, "Error occurred while updating views");
  
    let watchHistory;
    if (req.user) {
      watchHistory = await User.findByIdAndUpdate(
        req.user?._id,
        {
          $push: {
            watchHistory: new mongoose.Types.ObjectId(videoId),
          },
        },
        {
          new: true,
        }
      );
    }
  
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isSuccess: true, views: updatedVideo.views, watchHistory },
          "Video views updated successfully"
        )
      );
  });

export {
  getAllVideosByOption,
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  updateViewOfVideo
};
