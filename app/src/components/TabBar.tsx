import React from "react";
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { home, search, person, add, logoIonitron } from "ionicons/icons";

const TabBar: React.FC = () => {
  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/home">
        <IonIcon icon={home} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>

      <IonTabButton tab="search" href="/search">
        <IonIcon icon={search} />
        <IonLabel>Search</IonLabel>
      </IonTabButton>

      <IonTabButton tab="add" href="/add-recipe">
        <IonIcon icon={add} />
        <IonLabel>Add Recipe</IonLabel>
      </IonTabButton>
      <IonTabButton tab="ai" href="/ask-ai">
        <IonIcon icon={logoIonitron} />
        <IonLabel>Ask AI</IonLabel>
      </IonTabButton>

      <IonTabButton tab="profile" href="/profile/me">
        <IonIcon icon={person} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default TabBar;
