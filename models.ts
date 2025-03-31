import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    datePosted: { type: String, required: true },
    imageUrl: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    duration: { type: Number, required: true },
  },
  { versionKey: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    password: { type: String, required: true },
    recipesContributed: { type: Number, required: true },
    dateJoined: { type: String, required: true },
    imageUrl: { type: String },
  },
  { versionKey: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

export { Recipe, User };
