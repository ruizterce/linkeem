import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import { FollowModel } from "../models/FollowModel";

export const UserController = {
  // Handle user registration (sign up)
  register: async (req: Request, res: Response) => {
    const { email, username, password, profilePicture } = req.body;

    try {
      const newUser = await UserModel.create(
        email,
        username,
        password,
        profilePicture
      );
      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating user" });
    }
  },

  // Handle user profile retrieval
  getProfile: async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Follow a user
  followUser: async (req: Request, res: Response): Promise<Response | void> => {
    const { userId: followingId } = req.params;
    const { followerId } = req.body; // TODO: Replace with `req.user?.id` after implementing authentication middleware

    if (followerId === followingId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    try {
      const isFollowing = await FollowModel.isFollowing(
        followerId,
        followingId
      );
      if (isFollowing) {
        return res
          .status(400)
          .json({ message: "You are already following this user." });
      }

      const follow = await FollowModel.followUser(followerId, followingId);
      return res.status(201).json(follow);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error following user." });
    }
  },

  // Unfollow a user
  unfollowUser: async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    const { userId: followingId } = req.params;
    const { followerId } = req.body; // TODO: Replace with `req.user?.id` after implementing authentication middleware

    try {
      const isFollowing = await FollowModel.isFollowing(
        followerId,
        followingId
      );
      if (!isFollowing) {
        return res
          .status(400)
          .json({ message: "You are not following this user." });
      }

      await FollowModel.unfollowUser(followerId, followingId);
      return res.status(200).json({ message: "Unfollowed successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error unfollowing user." });
    }
  },
};
