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
  useIonToast,
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
  const [present] = useIonToast();
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const showToast = (message: string, color: string) => {
    present({
      message,
      duration: 2000,
      color,
      position: "middle",
    });
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    setIsDarkMode(theme === "dark");
  }, [localStorage.getItem("theme")]);

  const handleDarkModeToggle = (enabled: boolean) => {
    if (prefersDarkMode) {
      showToast("Dark mode is set in your system's preferences", "danger");
      return;
    }
    const theme = enabled ? "dark" : "light";
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setIsDarkMode(enabled);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Listen for changes to the system theme preference
    const handleThemeChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.body.setAttribute("data-theme", newTheme);
      setIsDarkMode(newTheme === "dark");
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

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
