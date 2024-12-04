import React, { useContext } from "react";
import { IonLabel, IonAvatar, IonRippleEffect, IonIcon } from "@ionic/react";
import { personAddOutline, personRemove } from "ionicons/icons";
import { useIonRouter, useIonToast } from "@ionic/react";
import { AuthContext } from "../contexts/AuthContext";
import { unfollowUser, followUser } from "../api/user";
import { PostContext } from "../contexts/PostContext";
import axios from "axios";
import { PostCardProps } from "@/types";

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useContext(AuthContext);
  const { triggerRefresh } = useContext(PostContext);
  const [present] = useIonToast();
  const router = useIonRouter();

  const isFollowing = post.author.followers && post.author.followers.length > 0;

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
        <div className="ion-activatable ripple-parent flex-col">
          {post.imgUrl && (
            <img
              src={post.imgUrl}
              alt={post.imgUrl}
              className="my-2 rounded-lg max-w-full h-auto max-h-screen bg-cover justify-self-center"
            />
          )}
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
