import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
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
import "./styles/tailwind.css";
import "./styles/global.css";

import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { PostProvider } from "./contexts/PostContext";
import TabMenu from "./components/TabMenu";
import Login from "./pages/Login";
import Register from "./pages/Register";

setupIonicReact();

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({ isAuthenticated, isLoading }) =>
          isLoading ? (
            <IonSpinner />
          ) : (
            <PostProvider>
              <IonApp className="max-w-screen-xl mx-auto p-4">
                <IonReactRouter>
                  <IonRouterOutlet>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    {isAuthenticated ? <TabMenu /> : <Redirect to="/login" />}
                  </IonRouterOutlet>
                </IonReactRouter>
              </IonApp>
            </PostProvider>
          )
        }
      </AuthContext.Consumer>
    </AuthProvider>
  );
};

export default App;
