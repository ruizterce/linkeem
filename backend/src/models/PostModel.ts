import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PostModel = {
  // Create a new post
  create: async (data: { content: string; authorId: string }) => {
    return await prisma.post.create({
      data,
    });
  },

  // Fetch a single post by ID
  getPostById: async (postId: string) => {
    return prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: { id: true, username: true, profilePicture: true },
            },
          },
        },
        likes: {
          select: {
            user: {
              select: { id: true, username: true, profilePicture: true },
            },
          },
        },
      },
    });
  },

  // Fetch recent posts for the user and their followings
  fetchRecentPosts: async (
    currentUserId: string,
    skip: number,
    take: number
  ) => {
    return await prisma.post.findMany({
      where: {
        OR: [
          { authorId: currentUserId },
          { author: { followers: { some: { followerId: currentUserId } } } },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: { select: { username: true } },
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  },

  // Update a post by ID
  updatePost: async (postId: string, content: string) => {
    return prisma.post.update({
      where: { id: postId },
      data: { content },
    });
  },

  // Delete a post by ID
  deletePost: async (postId: string) => {
    return prisma.post.delete({
      where: {
        id: postId,
      },
    });
  },
};
