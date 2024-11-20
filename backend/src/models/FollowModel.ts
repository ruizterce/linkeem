import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const FollowModel = {
  // Check if a user is following another user
  isFollowing: async (followerId: string, followingId: string) => {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
    return follow !== null;
  },

  // Add a follow relationship
  followUser: async (followerId: string, followingId: string) => {
    return prisma.follow.create({
      data: { followerId, followingId },
    });
  },

  // Remove a follow relationship
  unfollowUser: async (followerId: string, followingId: string) => {
    return prisma.follow.delete({
      where: {
        followerId_followingId: { followerId, followingId }, // Compound unique constraint
      },
    });
  },
};
