import React, { useState, useEffect, useRef } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonRefresher,
  IonRefresherContent,
  useIonRouter,
  useIonToast,
  IonLoading,
  IonText,
  IonImg,
  IonModal,
  IonButtons,
  IonIcon,
  IonItem,
  IonAvatar,
  IonLabel,
  IonRow,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { time, list, chevronBackOutline } from "ionicons/icons";

import RecipeCard from "../components/RecipeCard";
import { apiService } from "../services/apiService";
import { Recipe } from "../types";
import { getFlagUrl } from "../utils/helpers";

const AllRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast] = useIonToast();
  const router = useIonRouter();
  const modal = useRef<HTMLIonModalElement>(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      await showToast({
        message: "Failed to load recipes",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchRecipes();
    event.detail.complete();
  };

  const handleCardClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    // router.push(`/recipe/${id}`);
  };

  const handleAuthorClick = (userId: string) => {
    if (userId !== "") {
      modal.current?.dismiss();
      router.push(`/profile/${userId}`);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>WhatsCooking</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="ion-padding">
          {recipes.length > 0 ? (
            <div>
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          ) : (
            <div className="container">
              <IonImg
                src="/assets/empty-plate.svg"
                alt="No recipes"
                className="photo-placeholder"
              />
              <IonText color="medium">
                <h3>No recipes yet</h3>
              </IonText>
              <IonText color="medium">
                <p>Be the first to share a recipe!</p>
              </IonText>
            </div>
          )}
        </div>
        <IonLoading isOpen={loading} message="Fetching recipes..." />
        <IonModal
          ref={modal}
          isOpen={!!selectedRecipe}
          onIonModalDidDismiss={() => setSelectedRecipe(null)}
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButtons onClick={() => modal.current?.dismiss()}>
                  <IonIcon
                    icon={chevronBackOutline}
                    color="dark"
                    style={{ marginLeft: "3px", fontSize: "30px" }}
                  />
                </IonButtons>
              </IonButtons>
              <IonTitle>Recipe Detail</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen scrollY={true}>
            <div className="container ion-padding-bottom">
              <div style={{ position: "relative", paddingTop: "105px" }}>
                <IonImg
                  src={selectedRecipe?.imageUrl}
                  alt={selectedRecipe?.title}
                  className="photo"
                />
              </div>

              <div>
                <IonText color="secondary">
                  <h3> {selectedRecipe?.title.slice(0, 24)}</h3>
                </IonText>
                <div>
                  <div className="row">
                    <IonIcon
                      icon={time}
                      color="secondary"
                      style={{ marginRight: "3px" }}
                    />
                    <span>{selectedRecipe?.duration} mins</span>
                  </div>
                  <div className="row" style={{ marginTop: "8px" }}>
                    <IonIcon
                      icon={list}
                      color="secondary"
                      style={{ marginRight: "3px" }}
                    />
                    <span>
                      {selectedRecipe?.ingredients.length} ingredients
                    </span>
                  </div>
                </div>
                <IonItem
                  lines="none"
                  className="ion-no-padding"
                  style={{ width: "100%" }}
                  onClick={() =>
                    handleAuthorClick(selectedRecipe?.user._id || "")
                  }
                >
                  <IonAvatar
                    slot="start"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <img
                      src={
                        selectedRecipe?.user.imageUrl ||
                        `https://ui-avatars.com/api/?name=${selectedRecipe?.user.name}&background=random&size=200`
                      }
                      alt="User"
                    />
                  </IonAvatar>
                  <IonLabel color={"dark"}>
                    <h3 style={{ fontSize: "16px" }}>
                      {selectedRecipe?.user.name}
                    </h3>
                    <IonText color={"medium"}>
                      <p style={{ fontSize: "12px" }}>
                        Posted on {selectedRecipe?.datePosted?.substring(0, 10)}
                      </p>
                    </IonText>
                  </IonLabel>
                  <IonRow slot="end" className="ion-no-padding">
                    <IonImg
                      src={getFlagUrl(`${selectedRecipe?.user.country}`)}
                      alt="Flag"
                      style={{ width: "auto", height: "40px" }}
                    />
                  </IonRow>
                </IonItem>
                <h2>Ingredients</h2>
                <ul>
                  {selectedRecipe?.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>

                <h2>Instructions</h2>
                <div>{selectedRecipe?.instructions}</div>
                <p></p>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default AllRecipes;
