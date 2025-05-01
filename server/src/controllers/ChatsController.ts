import { Request,Response } from "express"
import prisma from "../config/db.config.js"
import cloudinary from "../config/cloud.config.js"
import Multer from "multer";

class ChatsController {
     static async index(req:Request,res:Response){
     
       const {groupId} = req.params
       console.log("no msg")
       const chats = await prisma.chats.findMany({
        where:{
            group_id : groupId
        }
       })

       res.json({message:"chats fetch successfully",data:chats})
     }


     static async store(req:Request, res:Response){
        try {
            const body = req.body;
            const profileImage = req.file;
            console.log("profileimageee",profileImage)
            // Upload file buffer to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: "chat_groups",
                  allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi", "webm"]
                },
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                }
              );
            
              uploadStream.end(profileImage.buffer); // Send file buffer
            });
            const formattedCounterReply =
  body.counter_reply ? JSON.parse(body.counter_reply) : null;
console.log("coter reply backend controller",formattedCounterReply)
  const data = await prisma.chats.create({
    data: {
      id:body.id,
      group_id: body.group_id,
      name: body.name,
      message: body.message,
      media_url: body.media_url,
      media_type: body.media_type,
      profile_image: body.profile_image,
      counter_reply: body?.counter_reply || null
    },
  }).catch(error => {
    console.error("Prisma Error:", error);
  });
  
            return res.json({ message: "msg create Successfully", data: data });
          } catch (error) {
            console.error("Error adding group user:", error); // Logs the exact error
            res.status(500).json({
              message: "An error occurred",
              error: error.message, // Optionally include the error message in the response
            });
          }
     }

     static async update(req: Request, res: Response) {
      try {
        const { id } = req.params;
        const { message } = req.body;
        console.log("updated msggg",message)
        console.log("updated iddd",id)
  
        const data = await prisma.chats.update({
          data: {
            message,  // Use only the updated message
          },
          where: {
            id: id,
          },
        });
        return res.json({ message: "message updated Successfully", data: data });
      } catch (error) {
        res.status(500).json({
          message: "something error",
        });
      }
    }

    static async delete(req: Request, res: Response) {
      try {
        const { id } = req.params;
  
        const data = await prisma.chats.delete({
          where: {
            id: id,
          },
        });
        return res.json({ message: "message deleted Successfully", data: data });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "something error",
        });
      }
    }
}

export default ChatsController