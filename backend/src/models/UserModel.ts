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

  updateProfilePicture: async (
    userId: string,
    profilePicturePath: string
  ): Promise<void> => {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profilePicture: profilePicturePath,
      },
    });
  },

  // Fetch user by ID
  findById: async (id: string) => {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  // Fetch user by ID
  findByIdExtended: async (id: string, currentUserId: string) => {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          select: {
            id: true,
            content: true,
            imgUrl: true,
            createdAt: true,
            comments: true,
            likes: true,
            author: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
                followers: {
                  where: { followerId: currentUserId },
                  select: { id: true },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        followers: {
          select: {
            follower: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
        },
        following: true,
        likes: true,
        comments: {
          orderBy: {
            createdAt: "desc",
          },
        },
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

  // Fetch users with search query and pagination
  fetchUsers: async (query: string, skip: number, take: number) => {
    return await prisma.user.findMany({
      where: {
        username: { contains: query, mode: "insensitive" }, // Case-insensitive search
      },
      select: {
        id: true,
        username: true,
        profilePicture: true, // Include avatar if available
      },
      orderBy: { username: "asc" },
      skip,
      take,
    });
  },
};
