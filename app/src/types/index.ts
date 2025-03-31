export interface User {
  _id: string;
  name: string;
  email: string;
  country: string;
  recipesContributed: number;
  dateJoined: string;
  imageUrl: string | null;
}

export interface BUser {
  _id: string;
  name: string;
  country: string;
  imageUrl: string | null;
}

export interface BRecipe {
  _id: string;
  userId: string;
  title: string;
  datePosted: string;
  imageUrl: string | null;
  ingredients: string[];
  instructions: string;
  duration: number; // in minutes
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface Recipe {
  _id: string;
  user: BUser;
  title: string;
  datePosted: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string;
  duration: number; // in minutes
}
