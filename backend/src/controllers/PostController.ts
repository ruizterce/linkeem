import { Request, Response } from "express";
import { PostModel } from "../models/PostModel";
import { LikeModel } from "../models/LikeModel";
import { body, ValidationChain, validationResult } from "express-validator";

export const PostController = {
  // Fetch recent posts
  getFollowedPosts: async (req: Request, res: Response) => {
    const currentUserId = req.user?.id;
    const { page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    try {
      const posts = await PostModel.fetchFollowedPosts(
        currentUserId,
        (pageNumber - 1) * limitNumber,
        limitNumber
      );
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Error fetching posts" });
    }
  },

  getPosts: async (req: Request, res: Response) => {
    const currentUserId = req.user?.id;
    const { page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }

    try {
      const posts = await PostModel.fetchPosts(
        currentUserId,
        (pageNumber - 1) * limitNumber,
        limitNumber
      );
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Error fetching posts" });
    }
  },

  // Fetch post by id
  getPostById: async (req: Request, res: Response) => {
    const currentUserId = req.user?.id;
    const { postId } = req.params;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const post = await PostModel.getPostById(postId);
      return res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Error fetching post" });
    }
  },

  // Create a new post
  createPost: async (req: Request, res: Response) => {
    const currentUserId = req.user?.id;
    const { content } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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

  validatePost: [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Post content cannot be empty")
      .isLength({ max: 420 })
      .withMessage("Post content cannot exceed 420 characters"),
  ] as ValidationChain[],

  // Update a post
  updatePost: async (req: Request, res: Response): Promise<Response | void> => {
    const { postId } = req.params;
    const { content } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      // Fetch the post to ensure the user is the author
      const post = await PostModel.getPostById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }

      if (post.authorId !== currentUserId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this post." });
      }

      // Update the post
      const updatedPost = await PostModel.updatePost(postId, content);
      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating post." });
    }
  },

  // Delete a post
  deletePost: async (req: Request, res: Response): Promise<Response | void> => {
    const { postId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Fetch the post to ensure the user is the author
      const post = await PostModel.getPostById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }

      if (post.authorId !== currentUserId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this post." });
      }

      // Delete the post
      await PostModel.deletePost(postId);
      return res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error deleting post." });
    }
  },

  // Like a post
  likePost: async (req: Request, res: Response): Promise<Response | void> => {
    const { postId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
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
