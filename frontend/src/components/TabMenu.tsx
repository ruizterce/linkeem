import React from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";
import { home, person } from "ionicons/icons";
import { Route } from "react-router-dom";
import Feed from "../pages/Feed";
import PostForm from "../pages/PostForm";
import PostDetail from "../pages/PostDetail";

const TabMenu: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/feed" component={Feed} />
        <Route exact path="/post" component={PostForm} />
        <Route exact path="/posts/:postId" component={PostDetail} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className="rounded-t-2xl shadow-t-md">
        <IonTabButton tab="feed" href="/feed">
          <IonIcon icon={home} />
          <IonLabel>Feed</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={person} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabMenu;
