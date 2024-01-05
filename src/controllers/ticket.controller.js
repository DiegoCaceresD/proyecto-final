import logger from "../config/logger.js";
import { ticketService } from "../services/factory.js";


export async function getAllTickets(req, res) {
    try {
      const tickets = await ticketService.getAllTickets();
      return res.status(200).json(tickets);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  }

export async function getTicketById(req, res) {
    try {
      let ticketId = req.params.tid;
      const ticket = await ticketService.getTicketById(ticketId);
      if(ticket){
          return res.status(200).json(ticket);
      }else{
        res.status(500).json({ error: "no se encontro Ticket" });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  }