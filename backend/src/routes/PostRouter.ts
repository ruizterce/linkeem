import { RequestHandler, Router } from "express";
import { PostController } from "../controllers/PostController";

const postRouter = Router();

// Route for getting recent posts (from user and followers)
postRouter.get("/", PostController.getRecentPosts as RequestHandler);

// Route for creating a new post
postRouter.post("/", PostController.createPost as RequestHandler);

// Like a post
postRouter.post("/:postId/like", PostController.likePost as RequestHandler);

// Unlike a post
postRouter.delete("/:postId/like", PostController.unlikePost as RequestHandler);

export default postRouter;
