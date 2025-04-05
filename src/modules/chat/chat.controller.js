import { Router } from "express";
import { getChat } from "./chat.service.js";
import authenticate from "../../middleware/auth.js";

const router = Router();

router.get("/:id", authenticate, getChat);

export default router;
