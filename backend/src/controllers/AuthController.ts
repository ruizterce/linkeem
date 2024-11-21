import { NextFunction, Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const AuthController = {
  // Register a new user
  register: async (req: Request, res: Response): Promise<Response | void> => {
    const { email, username, password } = req.body;
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

  authenticateJWT: (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Expect "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
      };
      req.user = decoded; // Add user info to the request object
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
  },
};
