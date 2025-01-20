import { Request, Response } from "express";
import prisma from "../config/db.config.js";

class ChatGroupController {
  static async store(req: Request, res: Response) {
    try {
      const body = req.body;
      const user = req.user;

      const data = await prisma.chatGroup.create({
        data: {
          user_id: user.id,
          title: body.title,
          passcode: body.passcode,
        },
      });
      return res.json({
        message: "Chat Group created Successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        message: "something error",
      });
    }
  }

  static async index(req: Request, res: Response) {
    try {
      const user = req.user;

      const data = await prisma.chatGroup.findMany({
        where: {
          user_id: user.id,
        },
        orderBy: {
          created_at: "desc",
        },
      });
      return res.json({
        message: "Chat Groups fetched Successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        message: "something error",
      });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log("Received ID:", id);

      // Ensure `id` is parsed to the correct type if needed
      const data = await prisma.chatGroup.findUnique({
        where: {
          id: id, // Use `Number(id)` if `id` is an integer, or directly `id` if it's a string/UUID
        },
      });

      if (!data) {
        return res.status(404).json({ message: "Chat Group not found" });
      }

      return res.json({ message: "Chat Group fetched successfully", data });
    } catch (error) {
      console.error("Error fetching Chat Group:", error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body;

      const data = await prisma.chatGroup.update({
        data: {
          title: body.title,
          passcode: body.passcode,
        },
        where: {
          id: id,
        },
      });
      return res.json({ message: "Chat updated Successfully", data: data });
    } catch (error) {
      res.status(500).json({
        message: "something error",
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const data = await prisma.chatGroup.delete({
        where: {
          id: id,
        },
      });
      return res.json({ message: "Chat deleted Successfully", data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "something error",
      });
    }
  }

 
}

export default ChatGroupController;
