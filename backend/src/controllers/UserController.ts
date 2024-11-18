import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";

export const UserController = {
  // Handle user registration (sign up)
  register: async (req: Request, res: Response) => {
    const { email, username, password, profilePicture } = req.body;

    try {
      const newUser = await UserModel.create({
        email,
        username,
        password,
        profilePicture,
      });
      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating user" });
    }
  },

  // Handle user profile retrieval
  getProfile: async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
