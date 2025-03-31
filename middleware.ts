import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "./models";

export interface TUser {
  _id: string;
  name: string;
  email: string;
  country: string;
  recipesContributed: number;
  dateJoined: string;
  imageUrl: string | null;
}

export interface CustomRequest extends Request {
  user?: TUser;
  token?: string;
}

interface DecodedToken {
  _id: string;
}

export const authenticate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Authentication failed. Token missing.");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_KEY as string
    ) as DecodedToken;
    const user = await User.findOne({
      _id: decoded._id,
    });

    if (!user) {
      throw new Error("Authentication failed. User not found.");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Authentication failed." });
  }
};

export async function generateAuthToken(userId: string, jwtKey: string) {
  console.log(userId);
  console.log(jwtKey);
  const token = jwt.sign({ _id: userId }, jwtKey);
  return token;
}
