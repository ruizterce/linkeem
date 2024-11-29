import { RequestHandler, Router } from "express";
import { PostController } from "../controllers/PostController";
import { AuthController } from "../controllers/AuthController";

const postRouter = Router();

// Get recent posts (all)
postRouter.get(
  "/discover",
  AuthController.authenticateJWT as RequestHandler,
  PostController.getPosts as RequestHandler
);

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
  PostController.getFollowedPosts as RequestHandler
);

// Create a new post
postRouter.post(
  "/",
  AuthController.authenticateJWT as RequestHandler,
  PostController.createPost as RequestHandler
);

// Update a post
postRouter.put(
  "/:postId",
  AuthController.authenticateJWT as RequestHandler,
  PostController.updatePost as RequestHandler
);

// Delete a post
postRouter.delete(
  "/:postId",
  AuthController.authenticateJWT as RequestHandler,
  PostController.deletePost as RequestHandler
);

// Like a post
postRouter.post(
  "/:postId/like",
  AuthController.authenticateJWT as RequestHandler,
  PostController.likePost as RequestHandler
);

// Unlike a post
postRouter.delete(
  "/:postId/like",
  AuthController.authenticateJWT as RequestHandler,
  PostController.unlikePost as RequestHandler
);

export default postRouter;
