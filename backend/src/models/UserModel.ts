import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const UserModel = {
  // Create a new user
  create: async (
    email: string,
    username: string,
    password: string,
    profilePicture?: string
  ) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
      data: { email, username, password: hashedPassword },
    });
  },

  // Verify password
  verifyPassword: async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
  },

  // Fetch user by ID
  findById: async (id: string) => {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
        followers: true,
        following: true,
      },
    });
  },

  // Find user by email
  findByEmail: async (email: string) => {
    return await prisma.user.findUnique({ where: { email } });
  },

  // Find user by username
  findByUsername: async (username: string) => {
    return await prisma.user.findUnique({ where: { username } });
  },

  // Fetch all users excluding those already followed
  findAllExcludingFollowed: async (currentUserId: string) => {
    return await prisma.user.findMany({
      where: {
        NOT: {
          followers: { some: { followerId: currentUserId } },
        },
      },
    });
  },
};
