import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import router from "./routes/index.js";

const app: Application = express();
const PORT = process.env.PORT || 7000;

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

app.get("/", (req, res) => res.send("It's working 🙌"));

app.use("/api", router);
console.log("first")

app.listen(PORT, () => console.log(`Server is running11111 on PORT ${PORT}`));
