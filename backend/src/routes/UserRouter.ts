import { Handler, RequestHandler, Router } from "express";
import { UserController } from "../controllers/UserController";

const userRouter = Router();

// Get a user's profile
userRouter.get("/:id", UserController.getProfile as RequestHandler);

// Create a new user
userRouter.post("/register", UserController.register as RequestHandler);

// Follow a user
userRouter.post("/:userId/follow", UserController.followUser as RequestHandler);

// Unfollow a user
userRouter.delete(
  "/:userId/follow",
  UserController.unfollowUser as RequestHandler
);

export default userRouter;
