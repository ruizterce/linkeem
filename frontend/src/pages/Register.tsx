import React, { useContext, useState } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { register } from "../api/auth";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { Redirect } from "react-router-dom";
import MainHeader from "../components/MainHeader";

const Register: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
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

  const handleRegister = async () => {
    try {
      console.log("Registering with:", { email, username, password });
      const data = await register(email, username, password);
      showToast(`${username} registered successfully!`, "success");
      router.push("/login", "forward");
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
      <MainHeader title="Register" />
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
                type="text"
                label="Username"
                labelPlacement="floating"
                value={username}
                placeholder="Enter your username"
                onIonInput={(e) => setUsername(e.detail.value!)}
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
              onClick={handleRegister}
              className="m-4"
            >
              Register
            </IonButton>
            <IonButton
              expand="block"
              shape="round"
              color="light"
              routerLink="/login"
              className="m-4"
            >
              Login
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
