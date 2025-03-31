import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export const takePhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
    });

    return `data:image/${image.format};base64,${image.base64String}`;
  } catch (error) {
    console.error("Error taking photo:", error);
    throw error;
  }
};

export const uploadImageToCloudinary = async (base64Image: string) => {
  try {
    // In a real app, you would probably want to send this to your backend
    // and have the backend handle the Cloudinary upload for security reasons
    const formData = new FormData();
    formData.append("file", base64Image);
    formData.append("upload_preset", "your_cloudinary_upload_preset"); // Replace with your preset

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
