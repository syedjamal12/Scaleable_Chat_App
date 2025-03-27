import { error } from "console";
import { Server, Socket } from "socket.io";
import prisma from "./config/db.config.js";
import { produceMessage } from "./helper.js";

interface customSocket extends Socket {
  room?: string;
  userId?:string
}

const onlineUsers = new Map<string, Set<string>>(); // Store multiple socket IDs per user
const lastSeen = new Map<string, string>(); // Track last seen timestamps


export function setupSocket(io: Server) {
  io.use((socket: customSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    const userId = socket.handshake.auth.userId || socket.handshake.headers.userId;
    console.log("backend userid",userId)
    if (!room || !userId) {
      return next(new Error("Invalid room or userId")); // ✅ Correct
    }
    socket.room = room
    socket.userId = userId;
    next();
  });

  io.on("connection", (socket: customSocket) => {
    socket.join(socket.room);

      // ✅ Store user as online (multiple sessions)
    if (!onlineUsers.has(socket.userId!)) {
      onlineUsers.set(socket.userId!, new Set());
  }
  onlineUsers.get(socket.userId!)!.add(socket.id);
// ✅ Broadcast user as online
io.to(socket.room).emit("updateUserStatus", {
  userId: socket.userId,
  status: "online",
});

    socket.on("message", async (data) => {
      console.log("📩 server side msg coming>>>", data);
      await produceMessage(process.env.KAFKA_TOPIC, data);
      socket.to(socket.room).emit("message", data);
    });

    socket.on("callUser", ({ roomId, from, signalData, isVideo }) => {
      console.log("🔔 Call initiated in room:", roomId);
      
      socket.to(roomId).emit("incomingCall", { from, signal: signalData, isVideo });
    });

    socket.on("answerCall", ({ roomId, signal, to }) => {
      io.to(roomId).emit("callAccepted", { signal, to });
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
    console.log("❌ User disconnected", socket.id);

    if (socket.userId) {
        const sessions = onlineUsers.get(socket.userId!);
        if (sessions) {
            sessions.delete(socket.id);

            // If no more active sessions, mark as offline
            if (sessions.size === 0) {
                onlineUsers.delete(socket.userId);
                lastSeen.set(socket.userId, new Date().toISOString());

                // ✅ Broadcast update to **all clients**, not just the room
                io.emit("updateUserStatus", {
                    userId: socket.userId,
                    status: "offline",
                    lastSeen: lastSeen.get(socket.userId),
                });
            }
        }
    }
});

  });
}

