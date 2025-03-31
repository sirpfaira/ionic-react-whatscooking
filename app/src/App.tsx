import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import AddRecipe from "./pages/AddRecipe";
import AskAI from "./pages/AskAI";

// Initialize Ionic
setupIonicReact();

// Protected Route component
const ProtectedRoute: React.FC<{
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}> = ({ component: Component, ...props }) => {
  const { authState, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...props}
      render={(routeProps) =>
        authState.isAuthenticated ? (
          <Component {...routeProps} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

// Public Route component (redirects to home if already authenticated)
const PublicRoute: React.FC<{
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}> = ({ component: Component, ...props }) => {
  const { authState, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...props}
      render={(routeProps) =>
        !authState.isAuthenticated ? (
          <Component {...routeProps} />
        ) : (
          <Redirect to="/home" />
        )
      }
    />
  );
};

const AppRoutes = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/splash" component={SplashScreen} />
        <PublicRoute exact path="/login" component={Login} />
        <PublicRoute exact path="/signup" component={SignUp} />
        <ProtectedRoute exact path="/home" component={Home} />
        <ProtectedRoute exact path="/search" component={Search} />
        <ProtectedRoute exact path="/profile/:id" component={Profile} />
        <ProtectedRoute exact path="/add-recipe" component={AddRecipe} />
        <ProtectedRoute exact path="/ask-ai" component={AskAI} />
        <Route exact path="/">
          <Redirect to="/splash" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App = () => (
  <AuthProvider>
    <IonApp>
      <AppRoutes />
    </IonApp>
  </AuthProvider>
);

export default App;
