import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import ChatGroupController from "../controllers/ChatGroupController.js";

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


router.post("/chat-user/:id", ChatGroupController.GroupUser);


export default router;
