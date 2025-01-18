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
import AuthCallback from "./pages/AuthCallback";
import { useEffect } from "react";

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    // Get theme from localStorage or default to system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // If there's no system preference, use saved theme
    let theme;
    if (prefersDarkMode) {
      theme = "dark";
    } else {
      theme = savedTheme || "light";
    }

    // Set the theme in localStorage and on the body element
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Listen for changes to the system theme preference
    const handleThemeChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.body.setAttribute("data-theme", newTheme);
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

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
                    <Route
                      exact
                      path="/auth/callback"
                      component={AuthCallback}
                    />
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
