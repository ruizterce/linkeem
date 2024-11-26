import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Clear all tables and reset sequences
  await prisma.$executeRaw`TRUNCATE TABLE "posts", "comments", "likes", "follows", "users" RESTART IDENTITY CASCADE`;

  // Create testing user
  const testUser = await prisma.user.create({
    data: {
      email: "test",
      username: "testUsername",
      password: await bcrypt.hash("123", 10),
      profilePicture: faker.image.avatar(),
    },
  });

  // Create users
  const users = [];
  for (let i = 0; i < 20; i++) {
    const rawPassword = faker.internet.password();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: hashedPassword,
        profilePicture: faker.image.avatar(),
      },
    });
    users.push(user);
  }

  // Create posts
  const posts = [];
  for (let i = 0; i < 40; i++) {
    const post = await prisma.post.create({
      data: {
        content: faker.lorem.paragraph(),
        authorId: users[Math.floor(Math.random() * users.length)].id,
      },
    });
    posts.push(post);

    // Add random comments to each post
    for (let j = 0; j < Math.floor(Math.random() * 10); j++) {
      await prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          postId: post.id,
          userId: users[Math.floor(Math.random() * users.length)].id,
        },
      });
    }

    // Add random likes to each post, check if like already exists
    for (let j = 0; j < Math.floor(Math.random() * 30); j++) {
      const randomUserId = users[Math.floor(Math.random() * users.length)].id;

      // Check if the user has already liked the post
      const existingLike = await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: randomUserId,
          },
        },
      });

      if (!existingLike) {
        await prisma.like.create({
          data: {
            postId: post.id,
            userId: randomUserId,
          },
        });
      }
    }
  }

  // Make testUser follows and is followed by a few users
  const usersToFollow = users.slice(0, 10); // Select the first users
  for (const user of usersToFollow) {
    await prisma.follow.create({
      data: {
        followerId: testUser.id,
        followingId: user.id,
      },
    });
    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: testUser.id,
      },
    });
  }

  // Create random follows between users
  for (let i = 0; i < 50; i++) {
    const followerId = users[Math.floor(Math.random() * users.length)].id;
    const followingId = users[Math.floor(Math.random() * users.length)].id;

    // Avoid self-following
    if (followerId === followingId) continue;

    // Check if the follow relationship already exists
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!existingFollow) {
      await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
