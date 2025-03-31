import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Recipe, User } from "./models";
import { CustomRequest, authenticate, generateAuthToken } from "./middleware";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/gaia";
const JWT_KEY = process.env.JWT_KEY || "67923061cbd6d2b77a250525";

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const data = await req.body;
    if (!data) {
      res.status(400).send("Please provide all the required fields!");
    } else {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new Error("User with that email already exists!");
      }
      const hashedPassword = await bcrypt.hash(data.password, 8);
      const newUser = {
        name: data.name,
        email: data.email,
        country: data.country,
        password: hashedPassword,
        recipesContributed: 0,
        dateJoined: new Date().toISOString(),
        imageUrl: null,
      };
      const user = await User.create(newUser);
      if (user != null) {
        const createdUser = user.toObject();
        delete createdUser["password"];
        const token = await generateAuthToken(createdUser._id, JWT_KEY);
        res.send({
          token: token,
          user: createdUser,
        });
      } else {
        throw new Error("No user created!");
      }
    }
  } catch (error: any) {
    res.status(500).send({ error: error?.message });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const data = await req.body;
    if (!data) {
      res.status(400).send("Please provide all the required fields!");
    } else {
      const user = await User.findOne({ email: data.email });
      if (!user) {
        throw new Error("No user found!");
      }

      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        throw new Error("Wrong password!");
      }
      const loggedInUser = user.toObject();
      delete loggedInUser["password"];
      const token = await generateAuthToken(loggedInUser._id, JWT_KEY);

      res.send({
        token: token,
        user: loggedInUser,
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// app.get("/recipes", authenticate, async (req: CustomRequest, res: Response) => {
//   await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
//   res.send(recipes);
// });

app.get("/recipes", authenticate, async (req: CustomRequest, res: Response) => {
  const recipes = await Recipe.find()
    .populate({ path: "user", select: "name country imageUrl" })
    .exec();
  res.send(recipes);
});

app.post(
  "/recipes",
  authenticate,
  async (req: CustomRequest, res: Response) => {
    try {
      const data = await req.body;
      if (!data) {
        throw new Error("No data!");
      }

      const newRecipe = {
        title: data.title,
        user: data.userId,
        datePosted: new Date().toISOString(),
        imageUrl: data.imageUrl,
        ingredients: data.ingredients,
        instructions: data.instructions,
        duration: data.duration,
      };
      const recipe = await Recipe.create(newRecipe);
      if (recipe) {
        res.send(recipe);
      } else {
        throw new Error("Could not save recipe!");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

app.post("/ask-ai", async (req: Request, res: Response) => {
  try {
    const { message } = await req.body;
    if (!message) {
      res.status(400).send("Message is required");
    } else {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: message,
      });
      res.send(response.text);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password -email");
    if (user != null) {
      // const foundUser = user.toObject();
      // delete foundUser["password"];
      // delete foundUser["email"];
      // res.send(foundUser);
      res.send(user);
    } else {
      throw new Error("No user found!");
    }
  } catch (error: any) {
    console.log("Error: ", error);
    res.json(null);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error: any) => {
      console.error("Error: ", error);
    });
});
