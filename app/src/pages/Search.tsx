import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
} from "@ionic/react";
import TabBar from "../components/TabBar";
import axios from "axios";

const Search: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

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
    console.log(uploadedImageUrl.url);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search Recipes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen></IonContent>
      <div className="container">
        <input onChange={uploadImage} id="dropzone-file" type="file" />
      </div>
      <TabBar />
    </IonPage>
  );
};

export default Search;
