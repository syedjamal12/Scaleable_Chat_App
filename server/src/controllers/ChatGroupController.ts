import { Request, Response } from "express";
import prisma from "../config/db.config.js";

class ChatGroupController {
  static async store(req: Request, res: Response) {
    try {
      const body = req.body;
      const user = req.user;
      const data = await prisma.chatGroup.create({
        data: {
          title: body?.title,
          passcode: body?.passcode,
          user_id: user.id,
        },
      });
      
      

      return res.json({ message: "Chat Group created successfully!",data });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }

 
}

export default ChatGroupController;