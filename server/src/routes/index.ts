import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import ChatGroupController from "../controllers/ChatGroupController.js";
import ChatGroupUserController from "../controllers/ChatGroupUserController.js";
import ChatsController from "../controllers/ChatsController.js";

const router = Router();

router.post("/auth/login", AuthController.login);
console.log("route check");
router.post("/chat-group", authMiddleware, ChatGroupController.store);

router.get("/user-groups", authMiddleware, ChatGroupController.index);

router.get("/chat-group/:id", ChatGroupController.show);

router.put(
  "/user-group-update/:id",
  authMiddleware,
  ChatGroupController.update
);

router.delete(
  "/user-group-delete/:id",
  authMiddleware,
  ChatGroupController.delete
);


router.post("/chat-group-user-create", ChatGroupUserController.store);
router.get("/chat-group-user", ChatGroupUserController.index);

// chat msg
router.get("/chat/:groupId", ChatsController.index);
router.post("/chat/create", ChatsController.store);



export default router;
