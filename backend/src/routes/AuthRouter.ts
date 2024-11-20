import { RequestHandler, Router } from "express";
import { AuthController } from "../controllers/AuthController";

const AuthRouter = Router();

AuthRouter.post("/register", AuthController.register as RequestHandler);
AuthRouter.post("/login", AuthController.login as RequestHandler);

export default AuthRouter;
