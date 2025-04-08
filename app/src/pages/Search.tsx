import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonImg,
  IonText,
  IonLoading,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { useState } from "react";
import { Recipe } from "../types";
import { apiService } from "../services/apiService";
import RecipeCard from "../components/RecipeCard";

const Search: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event: CustomEvent) => {
    const query = event.detail.value;
    if (query && query.length > 3) {
      try {
        setLoading(true);
        const data = await apiService.searchRecipes(query);
        setSearchResults(data);
      } catch (error) {
        console.error("Error searching recipes:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  function handleCardClick() {
    return;
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>Search Recipes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar
          debounce={500}
          onIonInput={handleSearch}
          placeholder="Search by title"
        />
        <IonList>
          <div className="ion-padding">
            {searchResults?.length > 0 ? (
              <div>
                {searchResults?.map((recipe) => (
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    onCardClick={handleCardClick}
                  />
                ))}
              </div>
            ) : (
              <div className="centered-column">
                <IonImg
                  src="/assets/empty-plate.svg"
                  alt="No recipes"
                  className="photo-placeholder"
                />
                <IonText color="medium">
                  <h3>No recipes found</h3>
                </IonText>
                <IonText color="medium">
                  <p>Try another keyword!</p>
                </IonText>
              </div>
            )}
          </div>
          <IonLoading isOpen={loading} message="Fetching recipes..." />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Search;
