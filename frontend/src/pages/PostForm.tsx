import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { PostContext } from "../contexts/PostContext";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonTextarea,
  IonToolbar,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import axios from "axios";
import { postPost } from "../api/post";

const PostForm: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { triggerRefresh } = useContext(PostContext);
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
    try {
      const data = await postPost(postContent);
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
      <IonHeader className="rounded-b-2xl">
        <IonToolbar className="rounded-b-2xl shadow-md">
          <IonButtons slot="start">
            <IonButton routerLink="/feed">
              <IonIcon icon={arrowBackOutline} slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
          <IonButtons slot="end" className="mr-4">
            <IonButton
              shape="round"
              fill="outline"
              size="small"
              onClick={handlePost}
            >
              <span className="font-extrabold">POST</span>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem lines="none">
          <IonTextarea
            placeholder="What's on your mind?"
            value={postContent}
            onIonInput={(e) => setPostContent(e.detail.value ?? "")}
            label={"- " + user?.username + ":"}
            labelPlacement="floating"
            counter={true}
            maxlength={420}
            autoGrow
          >
            <span slot="start">"</span>
            <span slot="end">"</span>
          </IonTextarea>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default PostForm;
