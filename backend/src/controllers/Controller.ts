import { Request, Response } from "express";
import { fetchHelloWorld } from "../models/Model";

export const getHelloWorld = async (req: Request, res: Response) => {
  try {
    const data = await fetchHelloWorld();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
