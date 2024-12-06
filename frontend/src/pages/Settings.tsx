import MainHeader from "../components/MainHeader";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from "@ionic/react";
import { informationCircleOutline } from "ionicons/icons";
import React from "react";

const Settings: React.FC = () => {
  return (
    <IonPage>
      <MainHeader title="Settings" />
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonSelect label="Default Tab" placeholder="Make a Selection">
              <IonSelectOption value="/feed">Feed</IonSelectOption>
              <IonSelectOption value="/discover">Discover</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonToggle>Dark Mode</IonToggle>
          </IonItem>
          <IonItem button>
            <IonLabel>About</IonLabel>
            <IonIcon
              aria-hidden="true"
              icon={informationCircleOutline}
              slot="end"
            ></IonIcon>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
