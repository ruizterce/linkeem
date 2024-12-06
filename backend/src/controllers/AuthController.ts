import { NextFunction, Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";
import { body, ValidationChain, validationResult } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const AuthController = {
  // Register a new user
  register: async (req: Request, res: Response): Promise<Response | void> => {
    const { email, username, password } = req.body;

    // Input validation
    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        message: "Username must be between 3 and 20 characters",
      });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        message: "Username can only contain letters, numbers, and underscores",
      });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    try {
      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      const existingUsername = await UserModel.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already in use" });
      }

      const newUser = await UserModel.create(email, username, password);
      return res.status(201).json({
        message: "User registered successfully",
        user: {
          email: newUser.email,
          username: newUser.username,
          id: newUser.id,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error registering user" });
    }
  },

  // Validation middleware for user registration
  validateRegistration: [
    body("email")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("username")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Username can only contain letters, numbers, and underscores"
      ),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
  ] as ValidationChain[],

  // Login a user
  login: (req: Request, res: Response, next: Function) => {
    passport.authenticate(
      "local",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err || !user) {
          return res
            .status(400)
            .json({ message: info?.message || "Login failed" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
          expiresIn: "1h",
        });

        return res.json({ message: "Login successful", token });
      }
    )(req, res, next);
  },

  authenticateJWT: async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
      };
      // Fetch the user from the database
      const user = await UserModel.findById(decoded.id); // Adjust based on your model method
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = {
        id: user.id,
        email: user.email || "a",
        username: user.username,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      }; // Add user info to the request object

      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
  },

  verifyToken: (req: Request, res: Response) => {
    // If this route is hit and no errors are thrown by the middleware,
    // it means the token is valid and we can return success.
    if (!req.user) {
      return res
        .status(500)
        .json({ message: "User information is not available" });
    }
    const user = req.user;

    res.status(200).json({
      message: "Token is valid",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      },
    });
  },

  githubCallback: (req: Request, res: Response) => {
    // Generate JWT
    const user = req.user;
    if (!user) {
      res.json({
        message: "GitHub login failed",
      });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  },
};
