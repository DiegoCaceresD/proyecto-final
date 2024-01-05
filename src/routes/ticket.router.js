import express from "express"
import * as TicketController from "../controllers/ticket.controller.js"

const router = express.Router();

router.get("/", TicketController.getAllTickets);
router.get("/:tid", TicketController.getTicketById);

export default router;