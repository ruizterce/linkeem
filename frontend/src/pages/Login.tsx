import React, { useContext, useState } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonItem,
  useIonRouter,
  useIonToast,
  IonIcon,
  IonImg,
} from "@ionic/react";
import { Redirect } from "react-router";
import { login, loginGitHub } from "../api/auth";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import MainHeader from "../components/MainHeader";
import { logoGithub } from "ionicons/icons";

const Login: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Show toast notification
  const [present] = useIonToast();
  const showToast = (message: string, color: string) => {
    present({
      message,
      duration: 2000,
      color,
      position: "middle",
    });
  };
  const router = useIonRouter();

  const handleLogin = async () => {
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      const defaultTab = localStorage.getItem("defaultTab");
      window.location.href = defaultTab || "/feed";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        console.error("Error logging in:", errorMessage);
        showToast(errorMessage, "danger");
      } else {
        // For non-Axios errors
        console.error("Unexpected error:", error);
        showToast("An unexpected error occurred", "danger");
      }
    }
  };

  const handleGuestLogin = async () => {
    try {
      const guestEmail = "guest@account.com";
      const guestPassword = "12Guest34";
      const data = await login(guestEmail, guestPassword);
      localStorage.setItem("token", data.token);
      const defaultTab = localStorage.getItem("defaultTab");
      window.location.href = defaultTab || "/feed";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        console.error("Error logging in:", errorMessage);
        showToast(errorMessage, "danger");
      } else {
        // For non-Axios errors
        console.error("Unexpected error:", error);
        showToast("An unexpected error occurred", "danger");
      }
    }
  };

  // Redirect if the user is already authenticated
  if (user) {
    const defaultTab = localStorage.getItem("defaultTab");
    return <Redirect to={defaultTab || "/feed"} />;
  }

  return (
    <IonPage>
      <MainHeader title="Login" />
      <IonContent className="ion-padding">
        <div className="w-full flex flex-col ion-align-items-center">
          <img src="favicon.png" className="h-20 w-auto mb-4"></img>
          <h1 className="font-extrabold text-3xl text-secondary leading-7">
            Linkeem
          </h1>
          <h2 className="italic text-medium font-montserrat">
            Social, Simplified
          </h2>
          <div className="w-full max-w-md">
            <IonItem>
              <IonInput
                type="email"
                label="Email"
                labelPlacement="floating"
                value={email}
                placeholder="Enter your email"
                onIonInput={(e) => setEmail(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonInput
                type="password"
                label="Password"
                labelPlacement="floating"
                value={password}
                placeholder="Enter your password"
                onIonInput={(e) => setPassword(e.detail.value!)}
              />
            </IonItem>
            <IonButton
              expand="block"
              shape="round"
              onClick={handleLogin}
              className="m-4"
            >
              Login
            </IonButton>
            <IonButton
              expand="block"
              shape="round"
              onClick={loginGitHub}
              className="m-4"
              color="dark"
            >
              Login with GitHub <IonIcon icon={logoGithub}></IonIcon>
            </IonButton>

            <IonButton
              expand="block"
              shape="round"
              onClick={handleGuestLogin}
              className="m-4"
              color="primary"
            >
              Login as Guest
            </IonButton>

            <IonButton
              expand="block"
              shape="round"
              color="light"
              routerLink="/register"
              className="m-4"
            >
              Register
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
