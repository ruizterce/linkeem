import React, { useContext, useState, useEffect } from "react";
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  useIonRouter,
  useIonToast,
  IonIcon,
  IonFab,
  IonFabButton,
} from "@ionic/react";
import { AuthContext } from "../contexts/AuthContext";
import { unfollowUser, followUser } from "../api/user";
import { PostContext } from "../contexts/PostContext";
import PostCard from "./PostCard";
import axios from "axios";
import { chatbubbleOutline } from "ionicons/icons";

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
      <IonFab
        horizontal="end"
        vertical="bottom"
        slot="fixed"
        className="mb-2 mr-2 opacity-70 hover:opacity-100 active:opacity-100"
      >
        <IonFabButton routerLink="/post">
          <IonIcon icon={chatbubbleOutline}></IonIcon>
        </IonFabButton>
      </IonFab>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
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
