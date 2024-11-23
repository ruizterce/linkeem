import React, { useContext } from "react";
import { AuthContext } from "../App";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonPopover,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";

interface HeaderProps {
  title: string;
}

const MainHeader: React.FC<HeaderProps> = ({ title }) => {
  const { user, setUser } = useContext(AuthContext);
  const router = useIonRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login", "forward");
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton id="profile-button">
            <IonIcon
              className="text-light"
              icon={personCircleOutline}
              slot="icon-only"
            ></IonIcon>
          </IonButton>
          <IonPopover trigger="profile-button" dismissOnSelect={true}>
            <IonContent>
              <IonList>
                <IonItem>
                  <IonText className="text-primary">
                    <b>{user?.username}</b>
                  </IonText>
                </IonItem>
                <IonItem button={true} detail={false} onClick={handleLogout}>
                  Log out
                </IonItem>
              </IonList>
            </IonContent>
          </IonPopover>
        </IonButtons>
        <IonTitle className="text-light text-2xl font-extrabold">
          {title}
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default MainHeader;
