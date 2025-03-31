import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonLabel,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { send } from "ionicons/icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiService } from "../services/apiService";

interface Message {
  text: string;
  me: boolean;
}

const MessageSchema = z.object({
  message: z.string().min(2, "Message must contain at least 2 characters"),
});

const AskAI = () => {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(MessageSchema),
  });
  const [showToast] = useIonToast();
  const [showLoading, hideLoading] = useIonLoading();
  const [messages, setMessages] = useState<Message[]>([]);

  async function sendMessage(formData: z.infer<typeof MessageSchema>) {
    await showLoading();
    try {
      const data = await apiService.askAI(formData.message);
      setMessages([
        ...messages,
        { text: formData.message, me: true },
        { text: data, me: false },
      ]);
      reset({ message: "" });
    } catch (e: any) {
      await showToast({
        message: e.error_description || e.message || e.code,
        duration: 5000,
      });
    }
    await hideLoading();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>Chat With Gemini AI</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            width: "100%",
          }}
        >
          <div
            className="ion-padding"
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              overflowY: "auto",
            }}
          >
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <IonRow
                  key={index}
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: message.me ? "flex-end" : "flex-start",
                  }}
                >
                  <IonChip
                    style={{
                      margin: "10px",
                      maxWidth: "80%",
                      background: message.me ? "#007aff" : "#cfcdcc",
                      color: message.me ? "#ffffff" : "#000000",
                    }}
                  >
                    <IonLabel>{message.text}</IonLabel>
                  </IonChip>
                </IonRow>
              ))
            ) : (
              <div className="container">
                <IonText color={"medium"}>
                  <p style={{ textAlign: "center" }}>
                    Start a conversation by sending a message!
                  </p>
                </IonText>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit(sendMessage)}>
            <div
              style={{
                display: "flex",
                bottom: 0,
                background: "#ffffff",
                padding: "10px 20px",
                borderTop: "1px solid rgb(197, 198, 204)",
              }}
            >
              <IonInput
                fill="outline"
                placeholder="Send message at least 2 chars..."
                {...register("message")}
              />
              <IonButton
                style={{
                  margin: "0px 0 0 10px",
                }}
                type="submit"
              >
                <IonIcon icon={send} color="dark"></IonIcon>
              </IonButton>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AskAI;
