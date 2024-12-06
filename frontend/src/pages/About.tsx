import React from "react";
import {
  IonContent,
  IonIcon,
  IonNavLink,
  IonPage,
  IonText,
} from "@ionic/react";
import MainHeader from "../components/MainHeader";
import { logoGithub } from "ionicons/icons";

const About: React.FC = () => {
  return (
    <IonPage>
      <MainHeader title="About" />
      <IonContent className="ion-padding">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-primary">
            Welcome to Linkeem
          </h2>
          <p className="text-base leading-relaxed text-gray-700">
            Linkeem is a dynamic social media platform hobby project where you
            can share your thoughts, connect with others, and engage with the
            community.
          </p>

          <h3 className="text-xl font-semibold text-secondary">Our Features</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              🔐 Secure user authentication with JWT and Passport.js using local
              or GitHub OAuth 2.0 strategy.
            </li>
            <li>📸 Post creation with text and images.</li>
            <li>💬 Social interactions: Likes, comments, and following.</li>
            <li>👤 Personalizable profiles.</li>
            <li>📜 Infinite scrolling for seamless content discovery.</li>
          </ul>

          <h3 className="text-xl font-semibold text-secondary">Technology</h3>
          <p className="text-base leading-relaxed text-gray-700">
            Powered by modern tools like React, Ionic and Express.js, Linkeem
            delivers a responsive and intuitive user experience across web and
            mobile devices.
          </p>

          <h3 className="text-xl font-semibold text-secondary">
            About the Creator
          </h3>
          <p className="text-base leading-relaxed text-gray-700">
            Linkeem is crafted with love by{" "}
            <a
              href="https://github.com/ruizterce/linkeem"
              className="font-semibold text-primary"
            >
              <IonIcon icon={logoGithub}></IonIcon> ruizterce
            </a>
            , blending cutting-edge technology with a passion for connection and
            community-building.
          </p>

          <p className="text-base font-semibold text-center text-primary">
            Welcome to <span className="italic">Linkeem</span>!
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default About;
