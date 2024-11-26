import { RequestHandler, Router } from "express";
import { CommentController } from "../controllers/CommentController";
import { AuthController } from "../controllers/AuthController";

const commentRouter = Router();

// Create a comment
commentRouter.post(
  "/",
  AuthController.authenticateJWT as RequestHandler,
  CommentController.createComment as RequestHandler
);

// Delete a comment
commentRouter.delete(
  "/:commentId",
  AuthController.authenticateJWT as RequestHandler,
  CommentController.deleteComment as RequestHandler
);

export default commentRouter;
