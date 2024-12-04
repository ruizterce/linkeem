import {
  IonAvatar,
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonTextarea,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { fetchPostById, likePost, postComment, unlikePost } from "../api/post";
import { useParams } from "react-router";
import {
  chatbubblesOutline,
  heartOutline,
  heartSharp,
  personAddOutline,
  personRemove,
} from "ionicons/icons";
import LikesStack from "../components/LikesStack";
import { PostContext } from "../contexts/PostContext";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import MainHeader from "../components/MainHeader";
import { unfollowUser, followUser } from "../api/user";

interface Post {
  id: string;
  content: string;
  imgUrl: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    profilePicture: string;
    followers: [];
  };
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      username: string;
      profilePicture: string;
    };
  }[];
  likes: {
    user: {
      id: string;
      username: string;
      profilePicture: string;
    };
  }[];
}

interface PostDetailParams {
  postId: string;
}

const PostDetail: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { postId } = useParams<PostDetailParams>();
  const { triggerRefresh } = useContext(PostContext);
  const [post, setPost] = useState<Post>();
  const [hasFollowed, setHasFollowed] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [present] = useIonToast();
  const router = useIonRouter();

  const showToast = (message: string, color: string) => {
    present({
      message,
      duration: 2000,
      color,
      position: "middle",
    });
  };

  const loadPost = async (postId: string) => {
    const post = await fetchPostById(postId);
    setPost(post);
    const userHasFollowed = post?.author.followers.some(
      (follower: { id: string }) => {
        return follower.id.length > 0;
      }
    );
    setHasFollowed(userHasFollowed);
  };

  useEffect(() => {
    loadPost(postId);
  }, [postId]);

  const handleLike = async () => {
    const hasLiked = post?.likes.some(
      (like) => like.user.username === user?.username
    );

    if (hasLiked) {
      await unlikePost(postId);
    } else {
      await likePost(postId);
    }

    loadPost(postId);
    triggerRefresh();
  };

  const handleComment = async () => {
    if (!commentContent.trim()) {
      showToast("Comment content cannot be empty.", "danger");
      return;
    }

    try {
      await postComment(commentContent, postId);
      setIsCommentModalOpen(false);
      setCommentContent("");
      loadPost(postId);
      showToast("Comment posted", "success");
      triggerRefresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        console.error("Error posting:", errorMessage);
        showToast(errorMessage, "danger");
      } else {
        // For non-Axios errors
        console.error("Unexpected error:", error);
        showToast("An unexpected error occurred", "danger");
      }
    }
  };

  const handleFollow = async () => {
    try {
      if (!post) {
        showToast("No user found. Please try again later.", "danger");
        console.error("No target user to follow/unfollow.");
        return;
      }
      if (hasFollowed) {
        await unfollowUser(post.author.id);
        showToast("User Unfollowed", "danger");
        triggerRefresh();
      } else {
        await followUser(post.author.id);
        showToast("User Followed", "success");
        triggerRefresh();
      }
      setHasFollowed(!hasFollowed);
      await loadPost(post.id);
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

  if (!post) {
    return <div>No post</div>;
  }

  const hasLiked = post.likes.some(
    (like) => like.user.username === user?.username
  );

  return (
    <IonPage>
      <MainHeader title={"Post Details"} />
      <IonContent className="ion-padding">
        <div key={post.id} className="dark:bg-gray-800 ">
          <IonLabel className="text-primary dark:text-light">
            <div className="flex items-center mb-2">
              <div
                className="inline-flex items-center rounded-3xl pr-2 hover:bg-primary hover:text-light cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/users/${post.author.id}`);
                }}
              >
                <IonAvatar className="w-6 h-6 ">
                  <img src={post.author.profilePicture} alt="" />
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
                    icon={hasFollowed ? personRemove : personAddOutline}
                    style={{ transform: "translateY(2px)" }}
                  ></IonIcon>
                </button>
              )}
            </div>
            {post.imgUrl && (
              <img
                src={post.imgUrl}
                alt={post.imgUrl}
                className="my-2 rounded-lg max-w-full h-auto max-h-screen bg-cover justify-self-center"
              />
            )}
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {post.content}
            </p>
            <sub className="text-medium">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </sub>
            <div className="flex mt-4 ion-align-items-center gap-2">
              <div className="flex flex-col ion-justify-content-center">
                <IonButton
                  onClick={handleLike}
                  shape="round"
                  color={hasLiked ? "danger" : ""}
                  size="default"
                >
                  <IonIcon
                    icon={hasLiked ? heartSharp : heartOutline}
                    slot="icon-only"
                  ></IonIcon>
                </IonButton>
              </div>
              <div className="text-xl text-secondary">{post.likes.length}</div>
              <LikesStack post={post} />
            </div>
            <div className="mt-4 pt-4 border-dotted border-t-2">
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="mt-2 text-sm">
                    <div className="mb-2 text-primary dark:text-light">
                      <div
                        className="inline-flex items-center mb-2 rounded-3xl pr-2 hover:bg-primary hover:text-light cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/users/${comment.user.id}`);
                        }}
                      >
                        <IonAvatar className="w-6 h-6">
                          <img src={comment.user.profilePicture} alt="" />
                        </IonAvatar>
                        <span className="font-bold text-md ml-2">
                          {comment.user.username}
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
                  </div>
                ))}
              </div>
            </div>
          </IonLabel>
        </div>

        {/* Create Comment Modal */}
        <IonFab
          horizontal="end"
          vertical="bottom"
          slot="fixed"
          className="mb-2 mr-2 opacity-70 hover:opacity-100 active:opacity-100"
        >
          <IonFabButton
            onClick={() => setIsCommentModalOpen(true)} // Open modal programmatically
          >
            <IonIcon icon={chatbubblesOutline}></IonIcon>
          </IonFabButton>
        </IonFab>
        <IonModal
          isOpen={isCommentModalOpen}
          onDidDismiss={() => setIsCommentModalOpen(false)}
          initialBreakpoint={1}
          breakpoints={[0, 1]}
          style={{ "--height": "auto" }}
        >
          <div className="block ion-padding flex flex-col">
            <IonTextarea
              placeholder="Be kind to the author!"
              value={commentContent}
              onIonInput={(e) => setCommentContent(e.detail.value ?? "")}
              label={"- " + user?.username + ":"}
              labelPlacement="floating"
              counter={true}
              maxlength={360}
              autoGrow
            ></IonTextarea>
            <IonButton onClick={handleComment} shape="round">
              Comment
            </IonButton>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default PostDetail;
