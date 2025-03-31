import React, { useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonImg,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { useAuth } from "../contexts/AuthContext";

const SplashScreen: React.FC = () => {
  const router = useIonRouter();
  const { authState, isLoading } = useAuth();

  useEffect(() => {
    // Redirect after 2 seconds
    const timer = setTimeout(() => {
      if (authState.isAuthenticated) {
        router.push("/home", "forward", "replace");
      } else {
        router.push("/login", "forward", "replace");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, authState.isAuthenticated, isLoading]);

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false} className="ion-padding">
        <div className="container">
          <IonImg
            src="/assets/cooking-icon.svg"
            alt="WhatsCooking Logo"
            style={{ width: "100px", height: "100px" }}
          />
          <IonText color={"primary"} className="ion-margin-bottom">
            <h1>WhatsCooking</h1>
          </IonText>
          <IonText>Share your culinary creations with the world</IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SplashScreen;
