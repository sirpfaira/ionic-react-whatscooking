import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
  IonAvatar,
  IonButton,
  IonIcon,
  useIonRouter,
  useIonToast,
  IonLoading,
  IonText,
  IonLabel,
} from "@ionic/react";
import { RouteComponentProps } from "react-router";
import RecipeCard from "../components/RecipeCard";
import { apiService } from "../services/apiService";
import { User, Recipe } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { logOutOutline } from "ionicons/icons";

interface ProfileParams {
  id: string;
}

const Profile: React.FC<RouteComponentProps<ProfileParams>> = ({ match }) => {
  const { id } = match.params;
  const [user, setUser] = useState<User | null>(null);
  // const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { authState, logout } = useAuth();
  const router = useIonRouter();
  const [showToast] = useIonToast();
  const isOwnProfile =
    id === "me" || (user && authState.user && user._id === authState.user._id);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        let userId = id;

        if (id === "me" && authState.user) {
          userId = authState.user._id;
        }

        const userData = await apiService.getUserProfile(userId);
        if (userData) setUser(userData);

        // const userRecipes = await apiService.getUserRecipes(userId);
        // setRecipes(userRecipes);
      } catch (error) {
        console.error("Error fetching user data:", error);
        await showToast({
          message: "Failed to load profile",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login", "root", "replace");
  };

  const handleRecipeClick = (id: string) => {
    router.push(`/recipe/${id}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Profile</IonTitle>
          {isOwnProfile && (
            <IonButtons slot="end">
              <IonButton onClick={handleLogout}>
                <IonIcon slot="icon-only" icon={logOutOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="column ion-padding">
          {user ? (
            <div className="column">
              <IonAvatar className="avatar">
                <img
                  src={
                    user.imageUrl ||
                    `https://ui-avatars.com/api/?name=${user.name}&background=random&size=200`
                  }
                  alt={user.name}
                />
              </IonAvatar>

              <span className="subtitle top-space">{user.name}</span>
              <span>{user.country}</span>

              <div className="column top-space">
                <IonLabel color={"medium"}>
                  <span className="icon ">{user.recipesContributed}</span>
                  <span>Recipes</span>
                </IonLabel>
                <IonLabel color={"medium"}>
                  <span className="icon">Joined</span>
                  <span>
                    {new Date(user.dateJoined).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                </IonLabel>
              </div>
            </div>
          ) : (
            <div className="container">
              <IonText color={"medium"}>
                <h3>User not found</h3>
              </IonText>
            </div>
          )}
        </div>
        <IonLoading isOpen={loading} message="Fetching user profile..." />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
