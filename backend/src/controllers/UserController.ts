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
      return res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Handle user profile retrieval with extended information
  getProfileExtended: async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
      const user = await UserModel.findByIdExtended(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        posts: user.posts,
        followers: user.followers,
        following: user.following,
        likes: user.likes,
        comments: user.comments,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Follow a user
  followUser: async (req: Request, res: Response): Promise<Response | void> => {
    const { userId: followingId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (currentUserId === followingId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    try {
      const isFollowing = await FollowModel.isFollowing(
        currentUserId,
        followingId
      );
      if (isFollowing) {
        return res
          .status(400)
          .json({ message: "You are already following this user." });
      }

      const follow = await FollowModel.followUser(currentUserId, followingId);
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
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (currentUserId === followingId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }
    try {
      const isFollowing = await FollowModel.isFollowing(
        currentUserId,
        followingId
      );
      if (!isFollowing) {
        return res
          .status(400)
          .json({ message: "You are not following this user." });
      }

      await FollowModel.unfollowUser(currentUserId, followingId);
      return res.status(200).json({ message: "Unfollowed successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error unfollowing user." });
    }
  },
};
