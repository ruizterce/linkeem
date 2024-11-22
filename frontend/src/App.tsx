import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonLoading,
  IonRouterOutlet,
  IonSpinner,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import TabMenu from "./components/TabMenu";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState, createContext } from "react";
import { verifyToken } from "./api/auth";

setupIonicReact();

interface User {
  username: string;
  email: string;
  profilePicture: string;
  date: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  // Verify the token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      verifyToken(token)
        .then((response) => {
          console.log("Token verified");
          setIsAuthenticated(true);
          setUser({
            username: response.user.username,
            email: response.user.email,
            profilePicture: response.user.profilePicture,
            date: response.user.date,
          });
        })
        .catch((error) => {
          console.error("Token verification failed", error);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <IonSpinner></IonSpinner>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            {isAuthenticated ? <TabMenu /> : <Redirect to="/login" />}
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </AuthContext.Provider>
  );
};

export default App;
