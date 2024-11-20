import { Request, Response } from "express";
import { PostModel } from "../models/PostModel";
import { LikeModel } from "../models/LikeModel";

export const PostController = {
  // Handle fetching recent posts
  getRecentPosts: async (req: Request, res: Response) => {
    const { currentUserId } = req.body; //TODO set user with authentication middleware

    try {
      const posts = await PostModel.fetchRecentPosts(currentUserId);
      return res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching posts" });
    }
  },

  // Handle creating a new post
  createPost: async (req: Request, res: Response) => {
    const { content, currentUserId } = req.body; //TODO set user with authentication middleware

    try {
      const newPost = await PostModel.create({
        content,
        authorId: currentUserId,
      });
      return res.status(201).json(newPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating post" });
    }
  },

  // Like a post
  likePost: async (req: Request, res: Response): Promise<Response | void> => {
    const { postId } = req.params;
    const { currentUserId } = req.body; //TODO set user with authentication middleware

    try {
      const hasLiked = await LikeModel.hasLikedPost(postId, currentUserId);
      if (hasLiked) {
        return res
          .status(400)
          .json({ message: "You have already liked this post." });
      }

      const like = await LikeModel.likePost(postId, currentUserId);
      return res.status(201).json(like);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error liking post." });
    }
  },

  // Unlike a post
  unlikePost: async (req: Request, res: Response): Promise<Response | void> => {
    const { postId } = req.params;
    const { currentUserId } = req.body; //TODO set user with authentication middleware

    try {
      const hasLiked = await LikeModel.hasLikedPost(postId, currentUserId);
      if (!hasLiked) {
        return res
          .status(400)
          .json({ message: "You have not liked this post." });
      }

      await LikeModel.unlikePost(postId, currentUserId);
      return res.status(200).json({ message: "Unliked successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error unliking post." });
    }
  },
};
