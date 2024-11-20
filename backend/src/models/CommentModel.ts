import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CommentModel = {
  // Create a new comment
  createComment: async (content: string, postId: string, userId: string) => {
    return prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
    });
  },

  // Fetch a single comment by ID
  getCommentById: async (commentId: string) => {
    return prisma.comment.findUnique({
      where: { id: commentId },
    });
  },

  // Delete a comment
  deleteComment: async (commentId: string) => {
    return prisma.comment.delete({
      where: { id: commentId },
    });
  },
};
