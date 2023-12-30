import logger from "../../../../config/logger.js";
import { CartModel } from "../models/cart.model.js";


export default class cartService {
  constructor() {
    logger.debug("Working courses with Database persistence in mongodb");
  }

  createCart = async () => {
    try {
      const response = await CartModel.create({ products: [] });
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getAllCarts = async () => {
    try {
      const response = await CartModel.find();
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  getCartById = async (idCart) => {
    try {
      const response = await CartModel.findOne({ _id: idCart }).populate(
        "products.product"
      );
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  addProductToCartById = async (idCart, idProduct, quantity = 1) => {
    try {
        const cart = await CartModel.findOne({ _id: idCart });
        if (!cart) {
          throw new Error( "No existe el carrito indicado")
        }
        const existingProductIndex = cart.products.findIndex(
          (product) => product.product.toString() === idProduct
        );
    
        if (existingProductIndex !== -1) {
          // Producto ya existe en el carrito, actualiza la cantidad
          cart.products[existingProductIndex].quantity += quantity;
        } else {
          // Producto no existe en el carrito, agrégalo
          cart.products.push({
            product: idProduct,
            quantity: quantity,
          });
        }
    
        const response = await cart.save();
      return response;
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  };
  updateCart = async (idCart, data) => {
    try {
      let response;
      if (data) {
        response = await CartModel.findOneAndUpdate(
          { _id: idCart },
          { product: data },
          { new: true }
        );
      }
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  updateProductQuantity = async (idCart, idProduct, newQuantity) => {
    try {
      const response = await CartModel.updateOne(
        { _id: idCart, "products.product": idProduct },
        { $set: { "products.$.quantity": newQuantity } }
      );
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  deleteProductInCart = async (idCart, idProduct) => {
    try {
      const cart = await CartModel.findOne({ _id: idCart });
  
      const existingProductIndex = cart.products.findIndex(
        (product) => product.product.toString() === idProduct
      );
  
      if (existingProductIndex !== -1) {
        // Producto encontrado en el carrito
        if (cart.products[existingProductIndex].quantity > 1) {
          // Resta 1 a la cantidad si es mayor a 1
          cart.products[existingProductIndex].quantity -= 1;
        } else {
          // Si la cantidad es 1, elimina el objeto del carrito
          cart.products.splice(existingProductIndex, 1);
        }
  
        // Guarda los cambios en el carrito
        const response = await cart.save();
        return response;
      } else {
        throw new Error(`Producto ${idProduct} no encontrado en el carrito ${idCart}`);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
  deleteAllProductsInCart = async (idCart) => {
    try {
      const response = await CartModel.updateOne(
        { _id: idCart },
        { $set: { products: [] } }
      );
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
