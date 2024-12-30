import { Request,Response } from "express";
import prisma from "../config/db.config.js";
import jwt from "jsonwebtoken"

interface LoginPayLoad{
    name:string,
    email:string,
    provider:string,
    oauth_id:string,
    image?:string
}

class AuthController{
    static async login(req:Request,res:Response){
      const body:LoginPayLoad = req.body;
      try{
        let findUser = await prisma.user.findUnique({
            where:{
                email:body.email
            }
          })
          if(!findUser){
            findUser = await prisma.user.create({
                data:body
            })
          }
          let jwtPayload = {
            name:body.name,
            email:body.email,
            id:findUser.id
          }
          const token = jwt.sign(jwtPayload,process.env.JWT_SECRET,{
            expiresIn:"365d"
          })
          return res.json({
            message:"Logged in successfully",
            user : {
                ...findUser,
                token: `Bearer ${token}`
            }
          })

      }catch(error){
        return res.status(500).json({message:"something error"})
      }
     
    }
}

export default AuthController