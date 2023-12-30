import express from "express"
import * as CartsController from "../controllers/cartsController.js"


const router = express.Router();

router.post("/", CartsController.createCart);

router.get("/allcarts", CartsController.getAllCarts);

router.get("/:cid", CartsController.getCartById);

router.post("/:cid/product/:pid", CartsController.addProductTocartById);

router.post('/:cid/purchase', CartsController.purchaseCart);
  

//elminia del carrito el producto seleccionado
router.delete("/:cid/products/:pid", CartsController.deleteProductInCart);

//actualiza el carrito con un arreglo de productos con el formato especificado
router.put("/:cid", CartsController.updateCart);

//actualiza SOLO la cantidad de ejemplares del producto por cualquier cantidad pasada en el req.body
router.put("/:cid/products/:pid", CartsController.UpdateProductQuantity);

//elimina todos los productos del carrito
router.delete("/:cid", CartsController.deleteAllProductsInCart);

export default router