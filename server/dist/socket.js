import { produceMessage } from "./helper.js";
import { generateResult } from "./config/ai.config.js";
const onlineUsers = new Map(); // Store multiple socket IDs per user
const lastSeen = new Map(); // Track last seen timestamps
export function setupSocket(io) {
    io.use((socket, next) => {
        const room = socket.handshake.auth.room || socket.handshake.headers.room;
        const userId = socket.handshake.auth.userId || socket.handshake.headers.userId;
        console.log("backend userid", userId);
        if (!room || !userId) {
            return next(new Error("Invalid room or userId")); // ✅ Correct
        }
        socket.room = room;
        socket.userId = userId;
        next();
    });
    io.on("connection", (socket) => {
        socket.join(socket.room);
        // ✅ Store user as online (multiple sessions)
        if (!onlineUsers.has(socket.userId)) {
            onlineUsers.set(socket.userId, new Set());
        }
        onlineUsers.get(socket.userId).add(socket.id);
        // ✅ Broadcast user as online
        io.to(socket.room).emit("updateUserStatus", {
            userId: socket.userId,
            status: "online",
        });
        socket.on("message", async (data) => {
            if (!socket.room) {
                console.warn("⚠️ Message received before joining a room. Skipping...");
                return;
            }
            console.log("📩 Server-side msg coming >>>", data);
            // Always send user's message to others in the room
            io.in(socket.room).emit("message", data);
            await produceMessage(process.env.KAFKA_TOPIC, data);
            const AiMessage = data.message.includes('@ai');
            if (AiMessage) {
                const prompt = data.message.replace('@ai', '').trim();
                const result = await generateResult(prompt);
                const AIData = {
                    ...data,
                    id: `ai-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
                    name: 'AI',
                    message: result,
                    profile_image: 'https://res.cloudinary.com/dx3mtupmd/image/upload/v1745479652/chat_groups/iaocaqv2okjkh1qtkfor.jpg',
                    isAI: true,
                };
                console.log("🤖 AI reading msg for room:", socket.room);
                console.log("🧩 Rooms socket is in:", Array.from(socket.rooms));
                setTimeout(() => {
                    io.in(socket.room).emit("message", AIData);
                }, 500); // try 300-500ms delay
                await produceMessage(process.env.KAFKA_TOPIC, AIData);
            }
        });
        // ✅ Handle Edit Message Event
        socket.on("editMessage", async (updatedMessage) => {
            console.log("✏️ Edit message received on server:", updatedMessage);
            /// ✅ Broadcast to all users in the room, including the sender
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
                const sessions = onlineUsers.get(socket.userId);
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
