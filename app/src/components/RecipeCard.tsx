import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonAvatar,
  IonLabel,
  IonImg,
  IonIcon,
  IonText,
  IonRow,
} from "@ionic/react";
import { time, list } from "ionicons/icons";
import { Recipe } from "../types";
import { getElapsedTime, getFlagUrl } from "../utils/helpers";

interface RecipeCardProps {
  recipe: Recipe;
  onCardClick: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onCardClick }) => {
  return (
    <IonCard className="ion-margin-bottom" onClick={() => onCardClick(recipe)}>
      <div style={{ position: "relative" }}>
        <IonImg src={recipe.imageUrl} alt={recipe.title} className="photo" />
      </div>

      <IonCardHeader>
        <IonCardTitle>
          <IonText color="secondary"> {recipe.title.slice(0, 24)}</IonText>
        </IonCardTitle>
        <IonCardSubtitle>
          <div>
            <div className="row">
              <IonIcon icon={time} color="secondary" className="icon" />
              <span>{recipe.duration} mins</span>
            </div>
            <div className="row top-space">
              <IonIcon icon={list} color="secondary" className="icon" />
              <span>{recipe.ingredients.length} ingredients</span>
            </div>
          </div>
        </IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent className="row">
        <IonItem
          lines="none"
          className="ion-no-padding"
          style={{ width: "100%" }}
        >
          <IonAvatar slot="start" className="avatar">
            <img
              src={
                recipe.user.imageUrl ||
                `https://ui-avatars.com/api/?name=${recipe.user.name}&background=random&size=200`
              }
              alt="User"
            />
          </IonAvatar>
          <div className="column">
            <IonText color={"medium"}>
              <span className="subtitle">{recipe.user.name}</span>
            </IonText>
            <IonText color={"medium"}>
              <span className="small-text">
                {getElapsedTime(recipe.datePosted)}
              </span>
            </IonText>
          </div>
          <IonRow slot="end" className="ion-no-padding">
            <IonImg
              src={getFlagUrl(recipe.user.country)}
              alt="Flag"
              className="flag"
            />
          </IonRow>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
};

export default RecipeCard;
