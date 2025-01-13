import cors from "cors"
import "dotenv/config";
import express, { Application } from "express";
const app:Application = express()
import router from "./routes/index.js";
import {Server} from "socket.io"
import { createServer } from "http";
import { setupSocket } from "./socket.js";

const PORT = process.env.PORT || 7000;

const server =createServer(app)

const io = new Server(server, {
  cors:{
    origin:"*"
  }
})

setupSocket(io);
export {io}

// Log the port being used
console.log(`Using PORT: ${PORT}`);

// Log every incoming request
app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  next();
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow credentials
  })
);
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

// Start server
server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
