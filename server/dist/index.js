import cors from "cors";
import "dotenv/config";
import express from "express";
const app = express();
import router from "./routes/index.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { setupSocket } from "./socket.js";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import redis from "./config/redis.config.js";
import { instrument } from "@socket.io/admin-ui";
import { connectKafkaProducer } from "./config/kafka.config.js";
import { consumeMessage } from "./helper.js";
import dns from 'dns';
const PORT = process.env.PORT || 7000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://admin.socket.io"],
        credentials: true,
    },
    adapter: createAdapter(redis),
});
instrument(io, {
    auth: false,
    mode: "development",
});
setupSocket(io);
export { io };
dns.lookup('redis', (err, address) => {
    console.log('Redis resolved to:', address); // should be something like 172.18.0.3
});
// Log the port being used
console.log("Redis connected to:", process.env.REDIS_HOST);
console.log("Kafka broker used:", process.env.KAFKA_BROKER);
console.log(`Using PORT: ${PORT}`);
// Log every incoming request
app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.url}`);
    next();
});
// Middleware
app.use(cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow credentials
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Root route
app.get("/", (req, res) => {
    console.log("Root route hit");
    res.send("It's working 🙌");
});
// Mount router
console.log("Applying /api router");
app.use("/api", router);
connectKafkaProducer().catch((err) => {
    console.log("something wrong with kafka....");
});
consumeMessage(process.env.KAFKA_TOPIC).catch((err) => {
    console.log("The consumer err", err);
});
// Start server
server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
