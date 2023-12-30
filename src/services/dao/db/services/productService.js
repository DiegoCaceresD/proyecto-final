import { ProductModel } from "../models/product.model.js";
import CustomError from "../../../errors/CustomError.js";
import EErrors from "../../../errors/errors-enum.js";
import logger from "../../../../config/logger.js";

export default class productsService {
  constructor() {
    logger.debug("Working courses with Database persistence in mongodb");
  }

  addProduct = async (data) => {
    try {
      const response = await ProductModel.create(data);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getProducts = async (optionsQuery, options) => {
    try {
      let data = await ProductModel.paginate(optionsQuery, options);
      if (data.docs.length === 0) {
        throw new CustomError({
          name: "NoProductError",
          message: "No se encontraron productos con los parámetros indicados",
          code: EErrors.NO_PRODUCT_FOUND,
        });
      }
      let response = {
        status: "success",
        payload: data.docs,
        totalPages: data.totalPages,
        prevPage: data.prePage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: data.hasPrevPage
          ? `http://localhost:8080/api/products?page=${data.prevPage}`
          : null,
        nextLink: data.hasNextPage
          ? `http://localhost:8080/api/products?page=${data.nextPage}`
          : null,
      };

      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getProductById = async (idProduct) => {
    try {
      const response = await ProductModel.findById(idProduct);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  updateProduct = async (idProduct, data) => {
    try {
      let response;
      const existingProduct = await ProductModel.findById(idProduct);
      if (!existingProduct) {
        throw new CustomError({
          name: "ProductNotFoundError",
          message: "No se encontró el producto para actualizar",
          code: EErrors.PRODUCT_NOT_FOUND,
        });
      }
      if (data) {
        response = await ProductModel.findByIdAndUpdate(idProduct, data, {
          new: true,
        });
      }
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
