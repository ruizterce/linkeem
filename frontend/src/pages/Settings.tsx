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

const defaultTab = localStorage.getItem("defaultTab");
const formattedTab = defaultTab
  ? defaultTab.slice(1, 2).toUpperCase() + defaultTab.slice(2)
  : "Feed";

const Settings: React.FC = () => {
  return (
    <IonPage>
      <MainHeader title="Settings" />
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonSelect
              label="Default Tab"
              placeholder={formattedTab}
              onIonChange={(e) => {
                localStorage.setItem("defaultTab", e.detail.value);
              }}
            >
              <IonSelectOption value="/feed">Feed</IonSelectOption>
              <IonSelectOption value="/discover">Discover</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonToggle>Dark Mode</IonToggle>
          </IonItem>
          <IonItem button routerLink="/about">
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
