import { Handler, RequestHandler, Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import { FileController } from "../controllers/FileController";

const userRouter = Router();

// Get a user's profile with extended information
userRouter.get(
  "/:id/extended",
  AuthController.authenticateJWT as RequestHandler,
  UserController.getProfileExtended as RequestHandler
);

// Follow a user
userRouter.post(
  "/:userId/follow",
  AuthController.authenticateJWT as RequestHandler,
  UserController.followUser as RequestHandler
);

// Upload new profile picture
userRouter.post(
  "/:userId/profile-picture",
  AuthController.authenticateJWT as RequestHandler,
  FileController.uploadProfilePicture,
  UserController.updateProfilePicture as RequestHandler
);

// Unfollow a user
userRouter.delete(
  "/:userId/follow",
  AuthController.authenticateJWT as RequestHandler,

  UserController.unfollowUser as RequestHandler
);

// Get a user's profile
userRouter.get("/:id", UserController.getProfile as RequestHandler);

// Create a new user
userRouter.post("/register", UserController.register as RequestHandler);

// Get users query
userRouter.get(
  "/",
  AuthController.authenticateJWT as RequestHandler,
  UserController.getUsers as RequestHandler
);

export default userRouter;
