import React from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";
import { globeOutline, home, person, settings } from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import Feed from "../pages/Feed";
import PostForm from "../pages/PostForm";
import PostDetail from "../pages/PostDetail";
import UserDetail from "../pages/UserDetail";
import Users from "../pages/Users";
import Discover from "../pages/Discover";
import Settings from "../pages/Settings";

const TabMenu: React.FC = () => {
  return (
    <IonTabs className="bg-background">
      <IonRouterOutlet>
        <Route exact path="/posts/:postId" component={PostDetail} />
        <Route exact path="/users/:userId" component={UserDetail} />
        <Route exact path="/feed" component={Feed} />
        <Route exact path="/discover" component={Discover} />
        <Route exact path="/post" component={PostForm} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/">
          <Redirect to="/feed" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className="rounded-t-2xl shadow-t-md">
        <IonTabButton tab="feed" href="/feed">
          <IonIcon icon={home} />
          <IonLabel>Feed</IonLabel>
        </IonTabButton>
        <IonTabButton tab="discover" href="/discover">
          <IonIcon icon={globeOutline} />
          <IonLabel>Discover</IonLabel>
        </IonTabButton>
        <IonTabButton tab="users" href="/users">
          <IonIcon icon={person} />
          <IonLabel>Users</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/settings">
          <IonIcon icon={settings} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabMenu;
