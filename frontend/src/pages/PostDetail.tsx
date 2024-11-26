import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { fetchPostById, likePost, unlikePost } from "../api/post";
import { useParams } from "react-router";
import { arrowBackOutline, heartOutline, heartSharp } from "ionicons/icons";
import LikesStack from "../components/LikesStack";
import { PostContext } from "../contexts/PostContext";
import { AuthContext } from "../contexts/AuthContext";

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

  if (!post) {
    return <div>No post</div>;
  }

  const hasLiked = post.likes.some(
    (like) => like.user.username === user?.username
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink="/feed">
              <IonIcon icon={arrowBackOutline} slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
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
            <div className="flex mt-4 ion-align-items-center gap-2">
              <div className="flex flex-col ion-justify-content-center">
                <IonButton
                  onClick={handleLike}
                  shape="round"
                  color={hasLiked ? "danger" : "secondary"}
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
                    <div>
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
                    </div>
                  </IonItem>
                ))}
              </IonList>
            </div>
          </IonLabel>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PostDetail;
