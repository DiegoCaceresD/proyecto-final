import { TicketModel } from "../models/ticket.model.js";
import logger from "../../../../config/logger.js";

export default class TicketService {
  constructor() {
    logger.debug("Working with Ticket Database");
  }

  generateTicket = async (cart, purchaserEmail) => {
    const ticketData = {
      code: generateUniqueCode(), 
      purchase_datetime: new Date(),
      amount: calculateTotalAmount(cart), 
      purchaser: purchaserEmail,
    };

    try {
      const ticket = await TicketModel.create(ticketData);
      return { status: "success", ticketId: ticket._id, failedProductIds: [] };
    } catch (error) {
      logger.error(error);
      return {
        status: "error",
        ticketId: null,
        failedProductIds: cart.products.map((product) => product.product),
      };
    }
  };

  getAllTickets = async () => {
    try {
      const response = await TicketModel.find();
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getTicketById = async (idTicket) => {
    try {
      const response = await TicketModel.findById(idTicket);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

}
function generateUniqueCode() {
   const timestamp = new Date().getTime().toString(36);
   const randomDigits = Math.floor(Math.random() * 1000)
     .toString()
     .padStart(3, "0");
   return `${timestamp}${randomDigits}`;
 }

function calculateTotalAmount(cart) {
   let totalAmount = 0;
   for (const cartProduct of cart.products) {
     totalAmount += cartProduct.product.price * cartProduct.quantity;
   }
   return totalAmount;
 }
