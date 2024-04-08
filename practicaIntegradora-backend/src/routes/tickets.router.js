import { Router } from "express";
import { generateTicket } from "../controllers/tickets.controller.js";

export const router = Router()

router.post("/generate", generateTicket);