import ProductsDTO from "../services/DTO/productDTO.js";
import { productsService } from "../services/factory.js";
import { generateProducts } from "../utils.js";
import { productErrorInfo } from "../services/errors/messages/product-error.message.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/errors-enum.js";
import logger from "../config/logger.js";

export async function addProduct(req, res) {
  try {
    const { body } = req;

    if (!body) {
      throw CustomError.createError({
        name: "Product creation Error",
        cause: productErrorInfo(body),
        message: "Error tratando de crear el prducto",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    const response = await productsService.addProduct(body);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function getProducts(req, res) {
  try {
    let { limit, page, sort, category, availability, query } = req.query;

    let optionsQuery = {};
    if (query) optionsQuery.title = { $regex: new RegExp(query, "i") };
    if (category) optionsQuery.category = category;
    if (availability) optionsQuery.status = availability;

    const options = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    };
    if (sort) options.sort = { price: sort };

    let products = await productsService.getProducts(optionsQuery, options);
      products.payload = products.payload.map(
      (product) => new ProductsDTO(product)
    );
    res.status(200).send(products);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function getProductById(req, res) {
  try {
    let idProduct = req.params.pid;
    let product = await productsService.getProductById(idProduct);
    const productDTO = new ProductsDTO(product);
    return res.status(200).send({ status: "success", payload: productDTO });
  } catch (error) {
    req.logger.error(error)
    res.status(500).send({ status: "error", msg: error });
  }
}
export async function updateProduct(req, res) {
  let idProduct = req.params.pid;
  let data = req.body;
  try {
    if (!data) {
      throw CustomError.createError({
        name: "Product creation Error",
        cause: productErrorInfo(body),
        message: "Error tratando de crear el prducto",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    let productUpdated = await productsService.updateProduct(idProduct, data);
    return res.send({ status: "success", response: productUpdated });
  } catch (error) {
    req.logger.error(error)
    return res.status(500).send({ status: "error", msg: error });
  }
}
export async function deleteProduct(req, res) {
  let idProduct = req.params.pid;
  try {
    await productsService.deleteProduct(idProduct);
    return res.send({
      status: "success",
      msg: `El Producto ${idProduct} due eliminado del almacen exitosamente`,
    });
  } catch (error) {
    req.logger.error(error)
    res.status(500).send({ status: "error", msg: error.message });
  }
}

export async function getMockingProducts(req, res) {
  try {
    let products = [];

    for (let i = 0; i < 100; i++) {
      products.push(generateProducts());
    }
    return res.send({
      status: "success",
      payload: products,
    });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .send({ status: "error", msg: "No se pudo generar los productos" });
  }
}
