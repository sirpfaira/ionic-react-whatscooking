import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonText,
  IonLoading,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../contexts/AuthContext";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useIonRouter();
  const [showToast] = useIonToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(LoginSchema) });

  const handleLogin = async (data: z.infer<typeof LoginSchema>) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      router.push("/home", "forward", "replace");
    } catch (error) {
      await showToast({
        message: "Login failed. Please check your credentials.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false}>
        <div className="container">
          <div className="ion-text-center">
            <IonText color="tertiary">
              <h3>Welcome Back</h3>
            </IonText>
            <IonText color="tertiary">
              <p>Log in to see what's cooking</p>
            </IonText>
          </div>

          <form onSubmit={handleSubmit(handleLogin)}>
            <div>
              <IonInput
                label="Email"
                fill="outline"
                labelPlacement="floating"
                placeholder="johndoe@mail.com"
                {...register("email")}
                className="ion-margin-top"
              />
              {errors.email && (
                <span className="input-error">{errors.email.message}</span>
              )}
            </div>
            <div>
              <IonInput
                label="Password"
                fill="outline"
                labelPlacement="floating"
                type="password"
                {...register("password")}
                className="ion-margin-top"
              />
              {errors.password && (
                <span className="input-error">{errors.password.message}</span>
              )}
            </div>

            <IonButton
              expand="block"
              type="submit"
              className="ion-margin-top"
              color="primary"
            >
              Log In
            </IonButton>
          </form>

          <div className="centered-row">
            <IonText color="medium">Don't have an account?</IonText>
            <IonButton fill="clear" routerLink="/signup" color="primary">
              Register
            </IonButton>
          </div>
        </div>

        <IonLoading isOpen={loading} message="Logging in..." />
      </IonContent>
    </IonPage>
  );
};

export default Login;
