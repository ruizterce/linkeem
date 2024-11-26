import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPopover,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";

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
    <IonHeader className="rounded-b-2xl">
      <IonToolbar className="rounded-b-2xl shadow-md">
        {user && (
          <IonButtons slot="start">
            <IonButton
              id="profile-button"
              className="ion-activatable ripple-parent rounded-rectangle"
            >
              <IonAvatar
                style={{ height: "30px", width: "30px" }}
                className="border-2 border-solid border-medium"
              >
                <img src={user?.profilePicture} alt={user?.username} />
              </IonAvatar>
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
        )}
        <IonTitle className="text-light text-2xl font-extrabold">
          {title}
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default MainHeader;
