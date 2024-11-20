import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const LikeModel = {
  // Add a like to a post
  likePost: async (postId: string, userId: string) => {
    return prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
  },

  // Remove a like from a post
  unlikePost: async (postId: string, userId: string) => {
    return prisma.like.delete({
      where: {
        postId_userId: { postId, userId },
      },
    });
  },

  // Check if a user has liked a post
  hasLikedPost: async (postId: string, userId: string) => {
    const like = await prisma.like.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });
    return like !== null;
  },
};
