import React, { useContext } from "react";
import { IonLabel, IonAvatar, IonRippleEffect, IonIcon } from "@ionic/react";
import { personAddOutline, personRemove } from "ionicons/icons";
import { useIonRouter, useIonToast } from "@ionic/react";
import { AuthContext } from "../contexts/AuthContext";
import { unfollowUser, followUser } from "../api/user";
import { PostContext } from "../contexts/PostContext";
import axios from "axios";

interface PostCardProps {
  post: {
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
    likes: { userId: string }[];
  };
  onFollowToggle?: () => void; // Optional callback for follow/unfollow actions
}

const PostCard: React.FC<PostCardProps> = ({ post, onFollowToggle }) => {
  const { user } = useContext(AuthContext);
  const { triggerRefresh } = useContext(PostContext);
  const [present] = useIonToast();
  const router = useIonRouter();

  const isFollowing = post.author.followers.some(
    (follower) => follower.id === user?.id
  );

  const showToast = (message: string, color: string) => {
    present({
      message,
      duration: 2000,
      color,
      position: "middle",
    });
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(post.author.id);
        showToast("User Unfollowed", "danger");
      } else {
        await followUser(post.author.id);
        showToast("User Followed", "success");
      }
      triggerRefresh();
      if (onFollowToggle) onFollowToggle();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showToast(
          error.response?.data?.message || "An error occurred",
          "danger"
        );
      } else {
        showToast("An unexpected error occurred", "danger");
      }
    }
  };

  return (
    <div
      className="rounded-lg relative dark:bg-gray-800 border-2 border-solid border-gray-100 py-4 px-6 mb-4 hover:border-medium"
      onClick={() => router.push(`/posts/${post.id}`)}
    >
      <IonLabel className="text-primary dark:text-light">
        <div className="flex items-center mb-2">
          <div
            className="inline-flex items-center rounded-3xl pr-2 hover:bg-primary hover:text-light cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/users/${post.author.id}`);
            }}
          >
            <IonAvatar className="w-6 h-6">
              <img
                src={post.author.profilePicture || "default-profile-pic.jpg"}
                alt=""
              />
            </IonAvatar>
            <h1 className="font-semibold text-xl ml-2">
              {post.author.username}
            </h1>
          </div>
          {post.author.id !== user?.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFollow();
              }}
            >
              <IonIcon
                icon={isFollowing ? personRemove : personAddOutline}
                style={{ transform: "translateY(2px)" }}
              />
            </button>
          )}
        </div>
        <div className="ion-activatable ripple-parent">
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
          <IonRippleEffect className="rounded-md"></IonRippleEffect>
        </div>
      </IonLabel>
    </div>
  );
};

export default PostCard;