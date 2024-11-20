import { RequestHandler, Router } from "express";
import { PostController } from "../controllers/PostController";

const postRouter = Router();

// Get recent posts (from user and followers)
postRouter.get("/", PostController.getRecentPosts as RequestHandler);

// Create a new post
postRouter.post("/", PostController.createPost as RequestHandler);

// Update a post
postRouter.put("/:postId", PostController.updatePost as RequestHandler);

// Delete a post
postRouter.delete("/:postId", PostController.deletePost as RequestHandler);

// Like a post
postRouter.post("/:postId/like", PostController.likePost as RequestHandler);

// Unlike a post
postRouter.delete("/:postId/like", PostController.unlikePost as RequestHandler);

export default postRouter;
