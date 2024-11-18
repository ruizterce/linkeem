import { RequestHandler, Router } from "express";
import { UserController } from "../controllers/UserController";

const userRouter = Router();

// Route for getting a user's profile
userRouter.get("/:id", UserController.getProfile as RequestHandler);

// Route for creating a new user (e.g., during sign-up)
userRouter.post("/register", UserController.register as RequestHandler);

export default userRouter;
