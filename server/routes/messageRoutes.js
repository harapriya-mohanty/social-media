import express from "express";
import { getChatMessages, sendMessage, sseController } from "../controllers/messageController.js";
import { protect } from "../middlewares/auth.js";
import {upload } from "../configs/multer.js";

const messageRouter = express.Router();

messageRouter.get("/:userId",sseController);
messageRouter.post("/send", protect, upload.single("media"), sendMessage);
messageRouter.post("/get", protect, getChatMessages);

export default messageRouter;