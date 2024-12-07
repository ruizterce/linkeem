import { RequestHandler, Router } from "express";
import {
  validateSupportEmail,
  sendSupportEmail,
} from "../controllers/EmailController";
import { AuthController } from "../controllers/AuthController";
import rateLimit from "express-rate-limit";
import { validationResult } from "express-validator";

const supportRouter = Router();

// Rate limiter: Allow 1 requestsper user per 24 hours
const emailRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 Day
  max: 1, // limit each IP to 1 requests per window
  skip: (req) => {
    // Skip applying rate limiting if validation errors exist
    const errors = validationResult(req);
    return !errors.isEmpty();
  },
  handler: (req, res) => {
    // Custom handler for rate limit exceeded
    res
      .status(429)
      .json({
        message: "Max 1 message per day allowed, please try again later.",
      });
  },
});

supportRouter.post(
  "/contact",
  AuthController.authenticateJWT as RequestHandler,
  validateSupportEmail,
  emailRateLimiter,
  sendSupportEmail as RequestHandler
);

export default supportRouter;
