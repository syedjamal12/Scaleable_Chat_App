import { error } from "console";
import { Server, Socket } from "socket.io";
import prisma from "./config/db.config.js";

interface customSocket extends Socket {
  room?: string;
}

export function setupSocket(io: Server) {
  io.use((socket: customSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    if (!room) {
      return next(new error("Invalid room"));
    }
    socket.room = room;
    next();
  });

  io.on("connection", (socket: customSocket) => {
    socket.join(socket.room);

    socket.on("message", async (data) => {
      console.log("server side msg coming>>>", data);
      await prisma.chats.create({
        data: {
          group_id: data.group_id,
          message: data.message,
          name: data.name,
        },
      });
      socket.to(socket.room).emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });
}
