import React from "react";
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";

interface HeaderProps {
  title: string;
}

const MainHeader: React.FC<HeaderProps> = ({ title }) => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton>
            <IonIcon icon={personCircleOutline} slot="icon-only"></IonIcon>
          </IonButton>
        </IonButtons>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default MainHeader;
