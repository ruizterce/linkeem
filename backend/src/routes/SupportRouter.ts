import { RequestHandler, Router } from "express";
import { sendSupportEmail } from "../controllers/EmailController";
import { AuthController } from "../controllers/AuthController";

const supportRouter = Router();

supportRouter.post(
  "/contact",
  AuthController.authenticateJWT as RequestHandler,
  sendSupportEmail as RequestHandler
);

export default supportRouter;
