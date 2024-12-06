import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { fetchUserByIdExtended, followUser, unfollowUser } from "../api/user";
import {
  IonAvatar,
  IonButton,
  IonChip,
  IonContent,
  IonLabel,
  IonPage,
  IonRippleEffect,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  useIonRouter,
  useIonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import MainHeader from "../components/MainHeader";
import axios from "axios";
import { PostContext } from "../contexts/PostContext";
import ProfilePictureUploader from "../components/ProfilePictureUploader";
import PostCard from "../components/PostCard";
import { User, UserDetailParams } from "@/types";

const UserDetail: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams<UserDetailParams>();
  const { triggerRefresh } = useContext(PostContext);
  const [targetUser, setTargetUser] = useState<User>();
  const [hasFollowed, setHasFollowed] = useState<boolean>(false);
  const [present] = useIonToast();
  const router = useIonRouter();
  const [selectedSegment, setSelectedSegment] = useState("posts");

  const loadUser = async (userId: string) => {
    const targetUser = await fetchUserByIdExtended(userId);
    console.log(targetUser);
    setTargetUser(targetUser);

    const userHasFollowed = targetUser.followers.some(
      (follower: { follower: { id: string } }) =>
        follower.follower.id === user?.id
    );
    setHasFollowed(userHasFollowed);
  };

  useEffect(() => {
    loadUser(userId);
  }, [userId]);

  useIonViewWillEnter(() => {
    loadUser(userId);
  });
  // Reset segment to "posts" whenever targetUser changes
  useEffect(() => {
    setSelectedSegment("posts");
  }, [targetUser]);

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
      if (!targetUser) {
        showToast("No user found. Please try again later.", "danger");
        console.error("No target user to follow/unfollow.");
        return;
      }
      if (hasFollowed) {
        await unfollowUser(targetUser.id);
        showToast("User Unfollowed", "danger");
        triggerRefresh();
      } else {
        await followUser(targetUser.id);
        showToast("User Followed", "success");
        triggerRefresh();
      }
      setHasFollowed(!hasFollowed);
      await loadUser(userId);
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

  if (!targetUser) {
    return <div>No target user</div>;
  }

  /*if (
    !targetUser.followers ||
    !targetUser.following ||
    !targetUser.posts ||
    !targetUser.comments ||
    !targetUser.likes
  ) {
    return <div>Missing data</div>;
  }*/
  return (
    <IonPage>
      <MainHeader title={targetUser.username} />
      <IonContent className="ion-padding">
        <div className="flex flex-col items-center relative mb-8">
          {user?.id === targetUser.id ? (
            <ProfilePictureUploader targetUser={targetUser} />
          ) : (
            <img
              src={targetUser.profilePicture || "default-profile-pic.jpg"}
              alt={targetUser.username}
              className="h-40 w-40 border-8 border-primary shadow-xl"
              style={{ borderRadius: "100%" }}
            />
          )}

          <div className="flex flex-col items-center absolute bottom-0 translate-y-4">
            <h1 className="bg-primary text-light font-extrabold rounded-3xl py-2 px-4 shadow-xl">
              {targetUser.username}
            </h1>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <h2 className="font-bold text-3xl">
              {targetUser.followers ? targetUser.followers.length : "0"}
            </h2>
            <p className="text-sm">Followers</p>
          </div>
          <div className="flex justify-center">
            {targetUser.id !== user?.id && (
              <IonButton
                shape="round"
                color={hasFollowed ? "medium" : "primary"}
                size="small"
                onClick={handleFollow}
              >
                {hasFollowed ? "Unfollow" : "Follow"}
              </IonButton>
            )}
          </div>

          <div className="text-center">
            <h2 className="font-bold text-3xl">
              {targetUser.following ? targetUser.following.length : "0"}
            </h2>
            <p className="text-sm">Following</p>
          </div>

          <div className="text-center">
            <h2 className="font-bold text-2xl">
              {targetUser.posts ? targetUser.posts.length : "0"}
            </h2>
            <p className="text-sm">Posts</p>
          </div>

          <div className="text-center">
            <h2 className="font-bold text-2xl">
              {targetUser.comments ? targetUser.comments.length : "0"}
            </h2>
            <p className="text-sm">Comments</p>
          </div>

          <div className="text-center">
            <h2 className="font-bold text-2xl">
              {targetUser.likes ? targetUser.likes.length : "0"}
            </h2>
            <p className="text-sm">Likes</p>
          </div>
        </div>

        <div>
          <IonSegment
            value={selectedSegment}
            onIonChange={(e) => setSelectedSegment(String(e.detail.value))}
            className="sticky bg-background z-10 translate-y-4 sm:translate-y-2 md:translate-y-0"
            style={{ top: "-32px" }}
          >
            <IonSegmentButton
              value="posts"
              contentId="posts"
              className="bg-background"
            >
              <IonLabel className="text-xs">Posts</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton
              value="comments"
              contentId="comments"
              className="bg-background"
            >
              <IonLabel className="text-xs">Comments</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton
              value="followers"
              contentId="followers"
              className="bg-background"
            >
              <IonLabel className="text-xs">Followers</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          <IonSegmentView>
            <IonSegmentContent id="posts" hidden={selectedSegment !== "posts"}>
              <div className="py-4 flex flex-col items-center gap-4">
                {targetUser.posts ? (
                  targetUser.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div>No posts found for this user</div>
                )}
              </div>
            </IonSegmentContent>
            <IonSegmentContent
              id="comments"
              hidden={selectedSegment !== "comments"}
            >
              {targetUser.comments ? (
                targetUser.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="ion-activatable ripple-parent rounded-lg relative border-2 border-solid border-gray-100 py-4 px-6 mt-4 hover:border-medium dark:border-light dark:hover:border-medium"
                    onClick={() => {
                      router.push(`/posts/${comment.postId}`);
                    }}
                  >
                    <div className="mb-2 text-primary">
                      <div className="inline-flex items-center mb-2 rounded-3xl pr-2 hover:bg-primary hover:text-light cursor-pointer">
                        <IonAvatar className="w-6 h-6">
                          <img src={targetUser.profilePicture} alt="" />
                        </IonAvatar>
                        <span className="font-bold text-md ml-2">
                          {targetUser.username}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {comment.content}
                      </p>
                      <sub className="text-medium">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          }
                        )}
                      </sub>
                    </div>
                    <IonRippleEffect className="rounded"></IonRippleEffect>
                  </div>
                ))
              ) : (
                <div>No comments found for this user</div>
              )}
            </IonSegmentContent>
            <IonSegmentContent
              id="followers"
              hidden={selectedSegment !== "followers"}
            >
              <div className="py-4">
                {targetUser.followers ? (
                  targetUser.followers.map(({ follower }) => (
                    <IonChip
                      key={follower.id}
                      className="text-light bg-primary hover:bg-light hover:text-primary cursor-pointer"
                      onClick={() => {
                        router.push(`/users/${follower.id}`);
                      }}
                    >
                      <IonAvatar>
                        <img
                          alt={follower.username}
                          src={follower.profilePicture}
                        />
                      </IonAvatar>
                      <IonLabel
                        className="font-bold "
                        style={{
                          maxWidth: "200px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {follower.username}
                      </IonLabel>
                    </IonChip>
                  ))
                ) : (
                  <div>No followers found for this user</div>
                )}
              </div>
            </IonSegmentContent>
          </IonSegmentView>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserDetail;
