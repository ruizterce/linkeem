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
      window.location.href = "/feed";
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
    return <Redirect to="/feed" />;
  }

  return (
    <IonPage>
      <MainHeader title="Login" />
      <IonContent className="ion-padding">
        <div className="w-full flex flex-col ion-align-items-center">
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
