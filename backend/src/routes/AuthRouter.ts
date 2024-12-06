import { RequestHandler, Router } from "express";
import { AuthController } from "../controllers/AuthController";
import passport from "passport";

const AuthRouter = Router();

AuthRouter.post(
  "/register",
  AuthController.validateRegistration,
  AuthController.register as RequestHandler
);
AuthRouter.post("/login", AuthController.login as RequestHandler);

// GitHub Login
AuthRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub Callback
AuthRouter.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  AuthController.githubCallback
);

AuthRouter.get(
  "/verify-token",
  AuthController.authenticateJWT as RequestHandler,
  AuthController.verifyToken as RequestHandler
);

export default AuthRouter;
