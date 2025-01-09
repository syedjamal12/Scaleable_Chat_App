import { Router } from "express"; 
import AuthController from "../controllers/AuthController.js"; 
import authMiddleware from "../middlewares/AuthMiddleware.js"; 
import ChatGroupController from "../controllers/ChatGroupController.js";

const router = Router();

router.post("/auth/login", AuthController.login);
console.log("route check")
router.post("/chat-group", authMiddleware, ChatGroupController.store);

router.get("/user-groups", authMiddleware, ChatGroupController.index);

router.get("/user-group/:id", authMiddleware, ChatGroupController.show);

router.post("/user-group-update/:id", authMiddleware, ChatGroupController.update);

router.post("/user-group-delete/:id", authMiddleware, ChatGroupController.delete);






export default router;
