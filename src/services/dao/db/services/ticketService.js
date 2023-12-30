import { TicketModel } from "../models/ticket.model.js";
import { productsService } from "../../../factory.js";
import { cartsService } from "../../../factory.js";
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
      const response = await TicketModel.findOne({ _id: idTicket });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  performPurchase = async (cart) => {
    // Lógica para realizar la compra y verificar el stock
    // puedo usar la información del carrito y consultar el stock de cada producto
    // Actualiza el stock y realiza otras operaciones

    for (const cartProduct of cart.products) {
      const product = await productsService.getProductById(cartProduct.product);

      if (product.stock >= cartProduct.quantity) {
        // Suficiente stock, realiza la compra y actualiza el stock
        product.stock -= cartProduct.quantity;
        await product.save();
      } else {
        // No hay suficiente stock para el producto, maneja la situación según tus requisitos
        return {
          status: "error",
          msg: `No hay suficiente stock para el producto: ${product.title}`,
        };
      }
    }

    // Elimina todos los productos del carrito después de realizar la compra
    await cartsService.deleteAllProductsInCart(cart._id);

    return { status: "success", msg: "Compra realizada con éxito" };
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

 // carts.controller.js

// ... (código existente)

export const purchaseCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartService.getCartById(cartId);

    // Verificar el stock y realizar la compra
    const purchaseResult = await ticketService.generateTicket(cart, "user@example.com");

    // Manejar la respuesta del TicketService
    if (purchaseResult.status === "success") {
      // Filtrar los productos en el carrito para mantener solo aquellos que no pudieron comprarse
      const failedProductIds = purchaseResult.failedProductIds;
      const remainingProducts = failedProductIds.length
        ? cart.products.filter(product => !failedProductIds.includes(product.product))
        : cart.products;

      // Actualizar el carrito con los productos restantes
      await cartsService.updateCart(cartId, { products: remainingProducts });

      // Devolver la respuesta
      return res.status(200).json({
        status: "success",
        msg: "Compra realizada con éxito",
        ticketId: purchaseResult.ticketId,
        failedProductIds: failedProductIds,
      });
    } else {
      return res.status(400).json({
        status: "error",
        msg: "No se pudo completar la compra",
        failedProductIds: purchaseResult.failedProductIds,
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ status: "error", msg: error.message });
  }
};
