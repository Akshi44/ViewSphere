import mongoose, {isValidObjectId} from "mongoose";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Subscription} from '../models/subscription.model.js'

const toggleSubscription = asyncHandler(async(req,res)=>{
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) throw new ApiError(400, "This ChannelId is not valid");
  
    let isSubscribed;
  
    const response = await Subscription.findOne({
      subscriber: req.user?._id,
      channel: channelId,
    });
  
    if (response) {
      const res = await Subscription.deleteOne({
        subscriber: req.user?._id,
        channel: channelId,
      });
      isSubscribed = false;
    } 
    else {
      const newSubscription = await Subscription.create({
        subscriber: req.user?._id,
        channel: channelId,
      });
      if (!newSubscription) throw new ApiError(500, "Failed to toggle Subscription");
      isSubscribed = true;
    }
  
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isSubscribed },
          `${isSubscribed ? "Subscribed successfully" : "Un-Subscribed successfully"}`
        )
      );
})

// The details of subscribers of own channels
const getUserChannelSubscribers = asyncHandler(async(req,res)=>{
    const { channelId = req.user?._id } = req.params;

    if (!isValidObjectId(channelId)) throw new ApiError(400, "This ChannelId is not valid");
  
    const subscribersList = await Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "channel",
          foreignField: "subscriber",
          as: "subscribedChannels",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscriber",
          pipeline: [
            {
              $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribersSubscribers",
              },
            },
            {
              $project: {
                username: 1,
                avatar: 1,
                fullname: 1,
                subscribersCount: {
                  $size: "$subscribersSubscribers",
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$subscriber",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "subscriber.isSubscribed": {
            $cond: {
              if: {
                $in: ["$subscriber._id", "$subscribedChannels.channel"],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $group: {
          _id: "channel",
          subscriber: {
            $push: "$subscriber",
          },
        },
      },
    ]);
  
    const subscribers =
      subscribersList?.length > 0 ? subscribersList[0].subscriber : [];
  
    return res
      .status(200)
      .json(new ApiResponse(200, subscribers, "Subscriber fetched Successfully"));
})

// The details of channels that has been subscribed by the user itself.
const getSubscribedChannels = asyncHandler(async(req,res)=>{
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId))
      throw new ApiError(400, "This subscriberId is invalid");
  
    const subscribedChannels = await Subscription.aggregate([
      // get all subscribed channels
      {
        $match: {
          subscriber: new mongoose.Types.ObjectId(subscriberId),
        },
      },
      // get channel details
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "channel",
          pipeline: [
            {
              $project: {
                fullname: 1,
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$channel",
      },
      // get channel's subscribers
      {
        $lookup: {
          from: "subscriptions",
          localField: "channel._id",
          foreignField: "channel",
          as: "channelSubscribers",
        },
      },
      {
        // logic if current user has subscribed the channel or not
        $addFields: {
          "channel.isSubscribed": {
            $cond: {
              if: { $in: [req.user?._id, "$channelSubscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
          // channel subscriber count
          "channel.subscribersCount": {
            $size: "$channelSubscribers",
          },
        },
      },
      {
        $group: {
          _id: "subscriber",
          subscribedChannels: {
            $push: "$channel",
          },
        },
      },
    ]);
  
    const users =
      subscribedChannels?.length > 0
        ? subscribedChannels[0].subscribedChannels
        : [];
  
    return res
      .status(200)
      .json(
        new ApiResponse(200, users, "Subscribed channel list fetched successfully")
      );
})

export {toggleSubscription, getUserChannelSubscribers, getSubscribedChannels}


