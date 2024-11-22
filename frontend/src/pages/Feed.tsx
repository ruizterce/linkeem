import React from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import MainHeader from "../components/MainHeader";

const Feed: React.FC = () => {
  return (
    <IonPage>
      <MainHeader title="Feed" />
      <IonContent className="ion-padding">
        {/* Display feed content */}
        Welcome to your feed!
      </IonContent>
    </IonPage>
  );
};

export default Feed;
