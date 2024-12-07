import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
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
import MainHeader from "../components/MainHeader";
import { sendSupport } from "../api/support";

const SupportForm: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [messageContent, setMessageContent] = useState("");
  const [contactEmail, setcontactEmail] = useState("");
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

  const handleSend = async () => {
    if (!contactEmail.trim()) {
      showToast("Contact email cannot be empty.", "danger");
      return;
    }

    if (!messageContent.trim()) {
      showToast("Message content cannot be empty.", "danger");
      return;
    }

    try {
      const data = await sendSupport(messageContent, contactEmail);
      showToast("Message Sent", "success");
      router.push("/settings", "back");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        console.error("Error sending message:", errorMessage);
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
      <MainHeader title={"Contact Support"} />
      <IonContent className="ion-padding">
        <div className="w-full flex flex-col ion-align-items-center">
          <p>
            Use this form to contact our support team. Please note that Linkeem
            is a hobby project, so response times may vary. We appreciate your
            patience and kindly ask that you use this feature responsibly.
          </p>
          <IonInput
            type="email"
            label="Contact Email"
            labelPlacement="stacked"
            value={contactEmail}
            placeholder="Your email adress to receive the response"
            onIonInput={(e) => setcontactEmail(e.detail.value!)}
          />
          <IonTextarea
            value={messageContent}
            onIonInput={(e) => setMessageContent(e.detail.value ?? "")}
            label="Message"
            labelPlacement="floating"
            counter={true}
            maxlength={999}
            autoGrow
            className="w-full"
          ></IonTextarea>
          <IonButton onClick={handleSend} shape="round">
            Send Message to Support Team
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SupportForm;
