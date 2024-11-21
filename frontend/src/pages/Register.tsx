import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // TODO
  const handleRegister = async () => {
    // Call API to register
    console.log("Registering with:", { email, username, password });
    // Redirect to login on success
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            placeholder="Enter your email"
            onIonChange={(e) => setEmail(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput
            type="text"
            value={username}
            placeholder="Enter your username"
            onIonChange={(e) => setUsername(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            placeholder="Enter your password"
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>
        <IonButton expand="block" onClick={handleRegister}>
          Register
        </IonButton>
        <IonButton expand="block" color="light" routerLink="/login">
          Login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
