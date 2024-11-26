import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  IonAvatar,
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
import { arrowBackOutline } from "ionicons/icons";

interface HeaderProps {
  title: string;
  returnUrl?: string;
}

const MainHeader: React.FC<HeaderProps> = ({ title, returnUrl }) => {
  const { user, setUser } = useContext(AuthContext);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent | null>(null);
  const [popoverOffsetX, setPopoverOffsetX] = useState(0);

  const router = useIonRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsPopoverOpen(false);
    router.push("/login", "forward");
  };

  const handlePopoverOpen = (event: React.MouseEvent) => {
    setPopoverEvent(event.nativeEvent);
    setIsPopoverOpen(true);
  };

  const handlePageChange = () => {
    setIsPopoverOpen(false);
  };

  React.useEffect(() => {
    handlePageChange();
  }, []);

  // Calculate difference between Ionic app width and browser window width to
  // compensate IonPopover positioning issue when setting max-width to Ionic App
  const updatePopoverOffset = () => {
    const appWidth = document.querySelector(".ion-page")?.clientWidth || 0;
    const windowWidth = window.innerWidth;
    const offset = (windowWidth - appWidth) / 2;
    setPopoverOffsetX(offset > 0 ? offset : 0);
  };

  React.useEffect(() => {
    updatePopoverOffset();
    window.addEventListener("resize", updatePopoverOffset);
    return () => {
      window.removeEventListener("resize", updatePopoverOffset);
    };
  }, []);

  return (
    <IonHeader className="rounded-b-2xl">
      <IonToolbar className="rounded-b-2xl shadow-md flex items-center justify-between">
        {returnUrl && (
          <IonButtons slot="start">
            <IonButton routerLink={returnUrl}>
              <IonIcon
                icon={arrowBackOutline}
                slot="icon-only"
                className="ion-activatable ripple-parent rounded-rectangle"
              ></IonIcon>
            </IonButton>
          </IonButtons>
        )}
        <IonTitle className="text-light text-2xl font-extrabold absolute top-3 left-1/2 transform -translate-x-1/2 ">
          {title}
        </IonTitle>
        {user && (
          <IonButtons slot="end">
            <IonButton
              className="ion-activatable ripple-parent rounded-rectangle"
              onClick={handlePopoverOpen}
            >
              <IonAvatar
                style={{ height: "30px", width: "30px" }}
                className="border-2 border-solid border-medium"
              >
                <img src={user?.profilePicture} alt={user?.username} />
              </IonAvatar>
            </IonButton>
            <IonPopover
              isOpen={isPopoverOpen}
              onDidDismiss={() => setIsPopoverOpen(false)}
              event={popoverEvent}
              side="bottom"
              alignment="end"
              style={{
                "--offset-x": `-${popoverOffsetX}px`,
              }}
            >
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
      </IonToolbar>
    </IonHeader>
  );
};

export default MainHeader;
