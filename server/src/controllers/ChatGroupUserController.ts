import { Request,Response } from "express"
import prisma from "../config/db.config.js"

class ChatGroupUserController{
   static async index(req:Request,res:Response){
      try{
            const {group_id} = req.query
            const users = await prisma.groupUsers.findMany({
                where:{
                    group_id:group_id as string
                }
            })
            return res.json({message:"data fetch successfully", data:users})
      }catch(error){
        return res.status(500).json({message:"something error"})
      }
   }


   static async store(req: Request, res: Response) {
    try {
      const body = req.body;
      const data = await prisma.groupUsers.create({
        data: {
          group_id: body.id,
          name: body.name,
        },
      });
      return res.json({ message: "Group user added Successfully", data: data });
    } catch (error) {
      console.error("Error adding group user:", error); // Logs the exact error
      res.status(500).json({
        message: "An error occurred",
        error: error.message, // Optionally include the error message in the response
      });
    }
  }
  
}

export default ChatGroupUserController