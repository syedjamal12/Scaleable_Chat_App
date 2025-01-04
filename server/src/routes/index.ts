import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router()

router.post("/auth/login",AuthController.login)
console.log("second")

export default router