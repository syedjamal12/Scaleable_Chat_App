import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db.config.js";

interface LoginPayLoad{
    name:string,
    email:string,
    provider:string,
    oauth_id:string,
    image?:string
}

class AuthController{
  static async login(req: Request, res: Response) {
    const { name, email, provider, oauth_id, image }: LoginPayLoad = req.body;
    console.log("third")
    try {
      let user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        user = await prisma.user.create({
          data: { name, email, provider, oauth_id, image },
        });
      }
  
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "365d" }
      );
  
      return res.json({
        message: "Logged in successfully",
        user: {
          ...user,
          token: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
  
}

export default AuthController