import React, { useContext, useState, useEffect } from "react";
import {
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRippleEffect,
  IonAvatar,
  useIonRouter,
  IonButton,
  useIonToast,
} from "@ionic/react";
import { AuthContext } from "../contexts/AuthContext";
import { unfollowUser, followUser } from "../api/user";
import { PostContext } from "../contexts/PostContext";
import axios from "axios";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    profilePicture: string;
    followers: { id: string }[];
  };
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: { username: string };
  }[];
  likes: {
    userId: string;
  }[];
}

interface PostListProps {
  posts: Post[];
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

const PostList: React.FC<PostListProps> = ({ posts, loadMore, hasMore }) => {
  const { user } = useContext(AuthContext);
  const { triggerRefresh } = useContext(PostContext);
  const [present] = useIonToast();
  const router = useIonRouter();

  // Following status
  const [followingStatus, setFollowingStatus] = useState<{
    [key: string]: boolean;
  }>({});

  // Update followingStatus when posts change
  useEffect(() => {
    const newStatus = posts.reduce((acc, post) => {
      acc[post.author.id] = post.author.followers.some((follower) => {
        return follower.id.length > 0;
      });
      return acc;
    }, {} as { [key: string]: boolean });

    setFollowingStatus(newStatus);
  }, [posts, user?.id]);

  const showToast = (message: string, color: string) => {
    present({
      message,
      duration: 2000,
      color,
      position: "middle",
    });
  };

  const handleFollow = async (authorId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await unfollowUser(authorId);
        showToast("User Unfollowed", "danger");

        triggerRefresh();
      } else {
        await followUser(authorId);
        showToast("User Followed", "success");

        triggerRefresh();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        console.error("Error following/unfollowing user:", errorMessage);
        showToast(errorMessage, "danger");
      } else {
        // For non-Axios errors
        console.error("Unexpected error:", error);
        showToast("An unexpected error occurred", "danger");
      }
    }
  };

  return (
    <>
      {posts.map((post) => (
        <div
          key={post.id}
          className="ion-activatable ripple-parent rounded-lg relative dark:bg-gray-800 border-2 border-solid border-gray-100 py-4 px-6 mb-4 hover:border-medium"
          onClick={() => {
            router.push(`/posts/${post.id}`);
          }}
        >
          <IonLabel className="text-primary dark:text-light ">
            <div className="flex items-center mb-2">
              <div
                className="inline-flex items-center  rounded-3xl pr-2 hover:bg-primary hover:text-light cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/users/${post.author.id}`);
                }}
              >
                <IonAvatar className="w-6 h-6">
                  <img src={post.author.profilePicture} alt="" />
                </IonAvatar>
                <h1 className="font-semibold text-xl ml-2">
                  {post.author.username}
                </h1>
              </div>
              <IonButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollow(post.author.id, followingStatus[post.author.id]);
                }}
                shape="round"
                size="small"
                color={followingStatus[post.author.id] ? "danger" : "primary"}
                className="m-0"
              >
                {followingStatus[post.author.id] ? "Unfollow" : "Follow"}
              </IonButton>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {post.content}
            </p>
            <div className="w-full flex justify-between items-center">
              <div>
                <span className="text-sm text-primary dark:text-light">
                  {post.comments.length} Comments
                </span>
                <span className="text-medium"> | </span>
                <span className="text-sm text-secondary dark:text-light">
                  {post.likes.length} Likes
                </span>
              </div>

              <sub className="text-medium">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </sub>
            </div>
          </IonLabel>
          <IonRippleEffect className="rounded-md"></IonRippleEffect>
        </div>
      ))}

      <IonInfiniteScroll
        onIonInfinite={(e) => {
          loadMore().finally(() =>
            (e.target as HTMLIonInfiniteScrollElement).complete()
          );
        }}
        threshold="100px"
        disabled={!hasMore}
      >
        <IonInfiniteScrollContent
          loadingText="Loading more posts..."
          loadingSpinner="circular"
        ></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </>
  );
};

export default PostList;
