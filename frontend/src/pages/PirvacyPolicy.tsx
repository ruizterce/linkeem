import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import MainHeader from "../components/MainHeader";

const PrivacyPolicy: React.FC = () => {
  return (
    <IonPage>
      <MainHeader title="Privacy Policy & Disclaimer" />
      <IonContent className="ion-padding">
        <div className="text-gray-800 space-y-6">
          <h2 className="text-2xl font-bold">Privacy Policy</h2>
          <p>
            At Linkeem, we take your privacy seriously and are committed to
            protecting your personal data. This policy explains how we collect,
            use, and store your information in compliance with applicable laws,
            including the General Data Protection Regulation (GDPR).
          </p>
          <h3 className="text-xl font-semibold">Data Collection and Use</h3>
          <p>
            Linkeem collects personal data necessary to provide and improve our
            services, including:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              **Account Information**: When you create an account, we collect
              your name, email address, and a secure hashed version of your
              password.
            </li>
            <li>
              **Profile Data**: Information you choose to add to your profile,
              such as your profile picture.
            </li>
            <li>
              **Usage Data**: Interaction data, such as posts, likes, comments,
              and the followers you engage with.
            </li>
          </ul>
          <p>
            This data is used to operate the platform, provide personalized
            features, and ensure the safety and integrity of our community.
          </p>
          <h3 className="text-xl font-semibold">Your Rights</h3>
          <p>
            Under the GDPR, you have the following rights regarding your
            personal data:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              **Access**: You can request access to the data we hold about you.
            </li>
            <li>
              **Correction**: You can request corrections to inaccurate or
              incomplete data.
            </li>
            <li>
              **Deletion**: You have the right to request the deletion of your
              data.
            </li>
            <li>
              **Restriction**: You can request that we limit the processing of
              your data.
            </li>
            <li>
              **Portability**: You can request a copy of your data in a
              structured, machine-readable format.
            </li>
          </ul>
          <p>
            To exercise these rights, please contact us via the platform's
            support feature.
          </p>
          <h3 className="text-xl font-semibold">Data Retention and Security</h3>
          <p>
            We retain your data only for as long as necessary to provide our
            services and comply with legal obligations. We employ
            industry-standard security measures, including encryption, to
            protect your data from unauthorized access or misuse.
          </p>
          <h2 className="text-2xl font-bold">Disclaimer</h2>
          <p>
            Linkeem is a social media platform where users can share content and
            interact. By using Linkeem, you agree to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              **Content Responsibility**: You are solely responsible for the
              content you post. Ensure your content complies with all applicable
              laws and our community guidelines.
            </li>
            <li>
              **Prohibited Content**: Avoid posting harmful, offensive,
              defamatory, illegal, or inappropriate material. This includes but
              is not limited to hate speech, incitement to violence, and
              explicit material.
            </li>
          </ul>
          <h3 className="text-xl font-semibold">Platform Liability</h3>
          <p>
            Linkeem disclaims all liability for user-generated content. We do
            not endorse or take responsibility for the opinions, advice, or
            information shared by users on this platform.
          </p>
          <p>
            We reserve the right to remove content that violates these terms or
            harms the community, at our sole discretion.
          </p>
          <h3 className="text-xl font-semibold">
            External Links and Third-Party Services
          </h3>
          <p>
            Linkeem may contain links to external websites or third-party
            services. We are not responsible for the privacy practices or
            content of these external entities.
          </p>
          <p>
            By using Linkeem, you acknowledge that you have read and agree to
            this Privacy Policy and Disclaimer. For further inquiries, please
            contact our support team.
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PrivacyPolicy;
