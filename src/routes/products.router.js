import Router from "express"
import * as ProductController from "../controllers/productsController.js"
import CustomRouter from "./custom/custom.router.js";
// import { Router } from "express";
// import ProductManager from "../ProductManager.js";
// const productManager = new ProductManager();

const router = Router();

export default class ProductRouter extends CustomRouter{
  init() {
    this.post("/",["PUBLIC"], ProductController.addProduct);
    
    this.get("/",["PUBLIC"], ProductController.getProducts);

    this.get("/:pid",["PUBLIC"], ProductController.getProductById);

    this.put("/:pid",["ADMIN"], ProductController.updateProduct);

    this.delete("/delete/:pid",["ADMIN"], ProductController.deleteProduct);

    this.get("/mockingproducts/faker", ["PUBLIC"], ProductController.getMockingProducts);

  }
}
