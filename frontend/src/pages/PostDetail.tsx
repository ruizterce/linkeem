import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonTextarea,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { fetchPostById, likePost, postComment, unlikePost } from "../api/post";
import { useParams } from "react-router";
import {
  arrowBackOutline,
  chatbubble,
  chatbubblesOutline,
  heartOutline,
  heartSharp,
} from "ionicons/icons";
import LikesStack from "../components/LikesStack";
import { PostContext } from "../contexts/PostContext";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import MainHeader from "../components/MainHeader";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    profilePicture: string;
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
  const [commentContent, setCommentContent] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [present] = useIonToast();

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
  };

  useEffect(() => {
    loadPost(postId);
  }, []);

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

  if (!post) {
    return <div>No post</div>;
  }

  const hasLiked = post.likes.some(
    (like) => like.user.username === user?.username
  );

  return (
    <IonPage>
      <MainHeader title={"Post Details"} returnUrl="/feed" />
      <IonContent>
        <div key={post.id} className="dark:bg-gray-800 p-4">
          <IonLabel className="text-primary dark:text-light">
            <div className="flex ion-align-items-center mb-2">
              <IonAvatar className="w-6 h-6">
                <img src={post.author.profilePicture} alt="" />
              </IonAvatar>
              <h1 className="font-semibold text-xl ml-2">
                {post.author.username}
              </h1>
            </div>
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
            <div className="mt-4 border-dotted border-t-2">
              <IonList className="space-y-4" lines="none">
                {post.comments.map((comment) => (
                  <IonItem key={comment.id} className="mt-2 text-sm">
                    <div className="mb-2">
                      <div className="flex ion-align-items-center mb-2">
                        <IonAvatar className="w-6 h-6">
                          <img src={comment.user.profilePicture} alt="" />
                        </IonAvatar>
                        <span className="font-bold text-md text-gray-500 ml-2">
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
                  </IonItem>
                ))}
              </IonList>
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
