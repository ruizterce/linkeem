import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { PostContext } from "../contexts/PostContext";
import {
  IonButton,
  IonContent,
  IonInput,
  IonPage,
  IonTextarea,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import axios from "axios";
import { postPost } from "../api/post";
import MainHeader from "../components/MainHeader";

const PostForm: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { triggerRefresh } = useContext(PostContext);
  const [postImg, setPostImg] = useState("");
  const [postContent, setPostContent] = useState("");
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

  const handlePost = async () => {
    if (!postContent.trim()) {
      showToast("Post content cannot be empty.", "danger");
      return;
    }

    try {
      const data = await postPost(postContent, postImg);
      showToast("Post Created", "success");
      triggerRefresh();
      router.push("/feed", "back");
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

  return (
    <IonPage>
      <MainHeader title={"New Post"} />
      <IonContent className="ion-padding">
        <div className="w-full flex flex-col ion-align-items-center">
          <IonInput
            type="text"
            label="Image URL"
            labelPlacement="stacked"
            value={postImg}
            placeholder="(Optional) Enter an image URL"
            onIonInput={(e) => setPostImg(e.detail.value!)}
          />
          {postImg && (
            <img
              src={postImg}
              alt="Image not found"
              className="my-4 rounded-lg max-w-full max-h-80 bg-cover"
            />
          )}
          <IonTextarea
            placeholder="What's on your mind?"
            value={postContent}
            onIonInput={(e) => setPostContent(e.detail.value ?? "")}
            label={"- " + user?.username + ":"}
            labelPlacement="floating"
            counter={true}
            maxlength={420}
            autoGrow
            className="w-full"
          >
            <span slot="start">"</span>
            <span slot="end">"</span>
          </IonTextarea>
          <IonButton onClick={handlePost} shape="round">
            Post
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PostForm;
