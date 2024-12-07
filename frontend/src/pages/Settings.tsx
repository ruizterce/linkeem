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
import {
  documentLockOutline,
  informationCircleOutline,
  mailOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";

const defaultTab = localStorage.getItem("defaultTab");
const formattedTab = defaultTab
  ? defaultTab.slice(1, 2).toUpperCase() + defaultTab.slice(2)
  : "Feed";

const Settings: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", theme);
    setIsDarkMode(theme === "dark");
  }, []);

  const handleDarkModeToggle = (enabled: boolean) => {
    const theme = enabled ? "dark" : "light";
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setIsDarkMode(enabled);
  };

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
            <IonToggle
              checked={isDarkMode}
              onIonChange={(e) => handleDarkModeToggle(e.detail.checked)}
            >
              Dark Mode
            </IonToggle>
          </IonItem>
          <IonItem button routerLink="/about">
            <IonLabel>About</IonLabel>
            <IonIcon
              aria-hidden="true"
              icon={informationCircleOutline}
              slot="end"
            ></IonIcon>
          </IonItem>
          <IonItem button routerLink="/privacy-policy">
            <IonLabel>Privacy Policy & Disclaimer</IonLabel>
            <IonIcon
              aria-hidden="true"
              icon={documentLockOutline}
              slot="end"
            ></IonIcon>
          </IonItem>
          <IonItem button routerLink="/contact-support">
            <IonLabel>Contact Support</IonLabel>
            <IonIcon aria-hidden="true" icon={mailOutline} slot="end"></IonIcon>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
