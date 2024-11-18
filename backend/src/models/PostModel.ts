import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PostModel = {
  // Create a new post
  create: async (data: { content: string; authorId: string }) => {
    return await prisma.post.create({
      data,
    });
  },

  // Fetch recent posts for the user and their followings
  fetchRecentPosts: async (currentUserId: string) => {
    return await prisma.post.findMany({
      where: {
        OR: [
          { authorId: currentUserId },
          { author: { followers: { some: { followerId: currentUserId } } } },
        ],
      },
      include: {
        author: true,
        comments: true,
        likes: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
