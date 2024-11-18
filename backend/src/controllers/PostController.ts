import { Request, Response } from "express";
import { PostModel } from "../models/PostModel";

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
};
