import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
  IonAvatar,
  IonBackButton,
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
    <IonHeader className="ion-no-border bg-background">
      <IonToolbar className="rounded-b-2xl shadow-md text-center">
        <IonButtons slot="start">
          <IonBackButton></IonBackButton>
        </IonButtons>

        <IonTitle className="text-light text-2xl font-extrabold ">
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
                  <IonItem
                    button={true}
                    detail={false}
                    onClick={() => {
                      router.push(`/users/${user.id}`, "forward");
                      setIsPopoverOpen(false);
                    }}
                  >
                    My Profile
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
