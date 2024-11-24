import { RequestHandler, Router } from "express";
import { PostController } from "../controllers/PostController";
import { AuthController } from "../controllers/AuthController";

const postRouter = Router();

// Get post by ID
postRouter.get(
  "/:postId",
  AuthController.authenticateJWT as RequestHandler,
  PostController.getPostById as RequestHandler
);

// Get recent posts (from user and followers)
postRouter.get(
  "/",
  AuthController.authenticateJWT as RequestHandler,
  PostController.getRecentPosts as RequestHandler
);

// Create a new post
postRouter.post(
  "/",
  AuthController.authenticateJWT as RequestHandler,
  PostController.createPost as RequestHandler
);

// Update a post
postRouter.put("/:postId", PostController.updatePost as RequestHandler);

// Delete a post
postRouter.delete("/:postId", PostController.deletePost as RequestHandler);

// Like a post
postRouter.post("/:postId/like", PostController.likePost as RequestHandler);

// Unlike a post
postRouter.delete("/:postId/like", PostController.unlikePost as RequestHandler);

export default postRouter;
