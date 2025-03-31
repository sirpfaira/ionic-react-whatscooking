import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
  IonButton,
  IonInput,
  IonItem,
  IonTextarea,
  IonList,
  IonIcon,
  IonLoading,
  IonImg,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { camera, trash, add } from "ionicons/icons";
import { apiService } from "../services/apiService";
import { useAuth } from "../contexts/AuthContext";
import { takePhoto } from "../utils/imageUpload";

const AddRecipe: React.FC = () => {
  const { authState } = useAuth();
  const router = useIonRouter();
  const [showToast] = useIonToast();
  const [title, setTitle] = useState("New Recipe");
  const [duration, setDuration] = useState<number>(30);
  const [ingredients, setIngredients] = useState<string[]>(["Tomato"]);
  const [ingredient, setIngredient] = useState<string>("");
  const [instructions, setInstructions] = useState("Boil");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = async () => {
    if (ingredient.trim() !== "") {
      setIngredients([...ingredients, ingredient]);
      setIngredient("");
    } else {
      await showToast({
        message: "Please enter an ingredient!",
        duration: 3000,
      });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  // const handleImageCapture = async () => {
  //   try {
  //     const imageData = await takePhoto();
  //     setImageUrl(imageData);
  //   } catch (error) {
  //     await showToast({
  //       message: "Failed to capture image!",
  //       duration: 3000,
  //     });
  //   }
  // };

  const validateForm = async (): Promise<boolean> => {
    if (!title.trim()) {
      await showToast({
        message: "Please enter a title!",
        duration: 3000,
      });
      return false;
    }

    if (!duration || duration <= 0) {
      await showToast({
        message: "Please enter a valid duration!",
        duration: 3000,
      });
      return false;
    }

    const validIngredients = ingredients.filter((ing) => ing.trim() !== "");
    if (validIngredients.length === 0) {
      await showToast({
        message: "Please add at least one ingredient!",
        duration: 3000,
      });
      return false;
    }

    if (!instructions.trim()) {
      await showToast({
        message: "Please enter cooking instructions!",
        duration: 3000,
      });
      return false;
    }

    if (!imageUrl) {
      await showToast({
        message: "Please add an image of your dish!",
        duration: 3000,
      });
      return false;
    }

    return true;
  };

  const uploadImage = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "GaiaIonic");
    data.append("cloud_name", "scott-bemard");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/scott-bemard/image/upload",
      { method: "POST", body: data }
    );
    const uploadedImageUrl = await res.json();
    setImageUrl(uploadedImageUrl.url);
  };

  const handleSubmit = async () => {
    const validated = await validateForm();
    if (!validated) {
      return;
    }

    try {
      setLoading(true);

      // Filter out empty ingredients
      const validIngredients = ingredients.filter((ing) => ing.trim() !== "");

      if (imageUrl) {
        // Create recipe
        const recipeData = {
          userId: authState.user!._id,
          title,
          imageUrl: imageUrl,
          ingredients: validIngredients,
          instructions,
          duration,
        };

        await apiService.createRecipe(recipeData);
        await showToast({
          message: "Recipe added successfully!",
          duration: 3000,
        });
        router.push("/home");
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      await showToast({
        message: "Failed to add recipe. Please try again!",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Add Recipe</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSubmit}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="column ion-padding">
          {/* <div className="centered-column" onClick={handleImageCapture}>
            {imageUrl ? (
              <IonImg src={imageUrl} alt="Recipe" className="photo" />
            ) : (
              <div className="centered-column">
                <IonIcon color="medium" icon={camera} className="icon-medium" />
                <p>Add a photo of your dish</p>
              </div>
            )}
          </div> */}
          <div className="row">
            <input onChange={uploadImage} id="dropzone-file" type="file" />
          </div>
          <IonList lines="none" className="ion-padding-top">
            <IonInput
              label="Recipe Title"
              fill="outline"
              labelPlacement="floating"
              value={title}
              onIonChange={(e) => setTitle(e.detail.value!)}
              placeholder="E.g., Creamy Tomato Pasta"
            />

            <IonInput
              label="Cooking Time (minutes)"
              fill="outline"
              labelPlacement="floating"
              type="number"
              value={duration}
              onIonChange={(e) => setDuration(parseInt(e.detail.value!, 10))}
              min={1}
              className="input-top-space"
            />

            <IonTextarea
              label="Cooking Instructions"
              fill="outline"
              labelPlacement="floating"
              value={instructions}
              onIonChange={(e) => setInstructions(e.detail.value!)}
              rows={6}
              placeholder="Step-by-step cooking instructions..."
              className="input-top-space"
            />

            <div className="input-top-space">
              <div>
                <IonInput
                  type="text"
                  label="Ingredient"
                  fill="outline"
                  labelPlacement="floating"
                  value={ingredient}
                  onIonChange={(e) => setIngredient(e.detail.value!)}
                  className="input-top-space"
                />
                <IonButton
                  fill="outline"
                  size="small"
                  onClick={handleAddIngredient}
                  color={"secondary"}
                  className="top-space"
                >
                  <IonIcon icon={add} slot="start" />
                  Add Ingredient
                </IonButton>
              </div>
              <div className="input-top-space">
                <span className="subtitle input-top-space">Ingredients</span>
              </div>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="row bordered top-space">
                  <IonItem>
                    <span>{ingredient}</span>
                  </IonItem>
                  <IonButton
                    fill="clear"
                    color="danger"
                    onClick={() => handleRemoveIngredient(index)}
                  >
                    <IonIcon icon={trash} />
                  </IonButton>
                </div>
              ))}
            </div>
          </IonList>
        </div>

        <IonLoading isOpen={loading} message="Saving recipe..." />
      </IonContent>
    </IonPage>
  );
};

export default AddRecipe;
