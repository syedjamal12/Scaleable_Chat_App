import { Request, Response } from "express";
import prisma from "../config/db.config.js";

class ChatGroupController{
    static async store(req:Request, res:Response){
        try{
            const body = req.body;
            const user = req.user;

            await prisma.chatGroup.create({
                data:{

                    user_id:user.id,
                    title:body.title,
                    passcode:body.passcode
                }
            })
            return res.json({message:"Chat Group created Successfully"})
        }catch(error){
            res.status(500).json({
                message:"something error"
            })
        }
    }
}

export default ChatGroupController