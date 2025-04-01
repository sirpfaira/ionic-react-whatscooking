import axios from "axios";
import { User, Recipe, BRecipe } from "../types";

// Base URL for the backend API
const API_URL = "http://localhost:5000";

// Create axios instance with common headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authorization token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Authentication
  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  signup: async (
    name: string,
    email: string,
    password: string,
    country: string
  ) => {
    const response = await api.post("/signup", {
      name: name,
      email: email,
      password: password,
      country: country,
    });
    return response.data;
  },

  // Recipes
  getAllRecipes: async () => {
    const response = await api.get("/recipes");
    return response.data;
  },

  getRecipeById: async (id: string) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  getUserRecipes: async (userId: string) => {
    const response = await api.get(`/recipes/user/${userId}`);
    return response.data;
  },

  createRecipe: async (recipeData: Omit<BRecipe, "_id" | "datePosted">) => {
    const response = await api.post("/recipes", recipeData);
    return response.data;
  },

  updateRecipe: async (id: string, recipeData: Partial<Recipe>) => {
    const response = await api.put(`/recipes/${id}`, recipeData);
    return response.data;
  },

  deleteRecipe: async (id: string) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  searchRecipes: async (query: string) => {
    const response = await api.get(`/recipes/search?keyword=${query}`);
    return response.data;
  },

  // User
  getUserProfile: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUserProfile: async (id: string, userData: Partial<User>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  askAI: async (message: string) => {
    const response = await api.post("/ask-ai", { message: message });
    return response.data;
  },
};
