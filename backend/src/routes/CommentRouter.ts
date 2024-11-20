import { RequestHandler, Router } from "express";
import { CommentController } from "../controllers/CommentController";

const commentRouter = Router();

// Create a comment
commentRouter.post("/", CommentController.createComment as RequestHandler);

// Delete a comment
commentRouter.delete(
  "/:commentId",
  CommentController.deleteComment as RequestHandler
);

export default commentRouter;
