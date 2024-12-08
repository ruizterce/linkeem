import React, { useContext, useState } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonItem,
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
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
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
    // Client-side validation
    if (!email || !username || !password || !confirmPassword) {
      showToast("All fields are required", "danger");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast("Invalid email format", "danger");
      return;
    }
    if (username.length < 3 || username.length > 20) {
      showToast("Username must be between 3 and 20 characters", "danger");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      showToast(
        "Username can only contain letters, numbers, and underscores",
        "danger"
      );
      return;
    }
    if (password.length < 8) {
      showToast("Password must be at least 8 characters", "danger");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "danger");
      return;
    }

    try {
      const data = await register(email, username, password);
      showToast(`${username} registered successfully!`, "success");
      router.push("/login", "forward");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        console.error("Error registering:", errorMessage);
        showToast(errorMessage, "danger");
      } else {
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
      <MainHeader title="Register" />
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
            <IonItem>
              <IonInput
                type="password"
                label="Confirm Password"
                labelPlacement="floating"
                value={confirmPassword}
                placeholder="Confirm your password"
                onIonInput={(e) => setConfirmPassword(e.detail.value!)}
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
