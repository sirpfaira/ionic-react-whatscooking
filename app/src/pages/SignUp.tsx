import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonText,
  IonLoading,
  IonSelect,
  IonSelectOption,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";

const SignUpSchema = z
  .object({
    name: z.string().min(3, "Name must contain at least 3 characters!"),
    email: z.string().email(),
    password: z.string().min(6, "Password must contain at least 6 characters!"),
    confirmPassword: z.string(),
    country: z.string().min(3, "Country is required!"),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useIonRouter();
  const [showToast] = useIonToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "User 1",
      email: "user@mail.com",
      password: "123456",
      confirmPassword: "123456",
      country: "Nigeria",
    },
  });

  const handleSignUp = async (data: z.infer<typeof SignUpSchema>) => {
    try {
      setLoading(true);
      await signup(data.name, data.email, data.password, data.country);
      await showToast({
        message: "Registration successful",
        duration: 3000,
      });
      router.push("/home", "forward", "replace");
    } catch (error) {
      console.error("Registration error:", error);
      await showToast({
        message: "Registration failed!",
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
              <h3>Join WhatsCooking</h3>
            </IonText>
            <IonText color="tertiary">
              <p>Share your culinary creations</p>
            </IonText>
          </div>

          <form onSubmit={handleSubmit(handleSignUp)}>
            <div>
              <IonInput
                label="Full Name"
                fill="outline"
                labelPlacement="floating"
                type="text"
                placeholder="John Doe"
                {...register("name")}
              />
              {errors.name && (
                <span className="input-error">{errors.name.message}</span>
              )}
            </div>

            <div>
              <IonInput
                label="Email"
                fill="outline"
                labelPlacement="floating"
                placeholder="johndoe@mail.com"
                className="ion-margin-top"
                {...register("email")}
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
                className="ion-margin-top"
                {...register("password")}
              />

              {errors.password && (
                <span className="input-error">{errors.password.message}</span>
              )}
            </div>

            <div>
              <IonInput
                fill="outline"
                label="Confirm Password"
                labelPlacement="floating"
                type="password"
                className="ion-margin-top"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="input-error">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            <div>
              <IonSelect
                placeholder="Select Country"
                className="ion-margin-top"
                fill="outline"
                {...register("country")}
              >
                {countries.map((country) => (
                  <IonSelectOption key={country} value={country}>
                    {country}
                  </IonSelectOption>
                ))}
              </IonSelect>
              {errors.country && (
                <span className="input-error">{errors.country.message}</span>
              )}
            </div>

            <IonButton
              expand="block"
              type="submit"
              color="primary"
              className="ion-margin-top"
            >
              SignUp
            </IonButton>
          </form>

          <div className="centered-row">
            <IonText color="medium">Already have an account?</IonText>
            <IonButton
              fill="clear"
              routerLink="/login"
              color="primary"
              size="small"
            >
              Log In
            </IonButton>
          </div>
        </div>

        <IonLoading isOpen={loading} message="Creating your account..." />
      </IonContent>
    </IonPage>
  );
};

export default SignUp;

const countries = [
  "Netherlands",
  "Angola",
  "Australia",
  "Nigeria",
  "Zimbabwe",
  "United States",
  "United Kingdom",
];
