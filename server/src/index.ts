import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import router from "./routes/index.js";

const app: Application = express();
const PORT = process.env.PORT || 7000;

// Log the port being used
console.log(`Using PORT: ${PORT}`);

// Log every incoming request
app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  next();
});

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Your frontend URL
  methods: "GET, POST",
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

// Start server
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
