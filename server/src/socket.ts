import { error } from "console";
import { Server, Socket } from "socket.io";
import prisma from "./config/db.config.js";
import { produceMessage } from "./helper.js";

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
      console.log("📩 server side msg coming>>>", data);
      await produceMessage(process.env.KAFKA_TOPIC, data);
      socket.to(socket.room).emit("message", data);
    });

    // ✅ Handle Edit Message Event
    socket.on("editMessage", async (updatedMessage) => {
      console.log("✏️ Edit message received on server:", updatedMessage);

      // Broadcast edited message to all users in the room (except sender)
      io.to(socket.room).emit("editMessage", updatedMessage);
    });


    socket.on("deleteMessage", async (messageId) => {
      console.log("🗑️ Delete message received on server:", messageId);
  
      // ✅ Emit the delete event to all users, including the sender
      io.to(socket.room).emit("deleteMessage", messageId);
  });
  

    socket.on("disconnect", () => {
      console.log("❌ user disconnected", socket.id);
    });
  });
}

