import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const UserModel = {
  // Create a new user
  create: async (data: {
    email: string;
    username: string;
    password: string;
    profilePicture?: string;
  }) => {
    return await prisma.user.create({
      data,
    });
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
