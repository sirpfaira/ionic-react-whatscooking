import React from "react";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { IonTabs } from "@ionic/react";
import { Route, Redirect } from "react-router";
import TabBar from "../components/TabBar";
import AllRecipes from "./AllRecipes";
import AskAI from "./AskAI";
import AddRecipe from "./AddRecipe";
import Profile from "./Profile";

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/home" />
          <Route path="/home" render={() => <AllRecipes />} exact={true} />
          <Route path="/ask-ai" render={() => <AskAI />} exact={true} />
          <Route path="/add-recipe" render={() => <AddRecipe />} exact={true} />
          <Route exact path="/profile/:id" component={Profile} />
        </IonRouterOutlet>
        <TabBar />
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
