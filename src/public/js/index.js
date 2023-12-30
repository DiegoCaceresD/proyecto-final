import logger from "../../config/logger.js";
import * as CartsService from "../../db/services/cartsService.js"
import * as ProductService from "../../db/services/productService.js"
const productsDiv = document.getElementById('product');

async function renderProducts(){
    const data = await ProductService.getProducts();
    let div = "";
      data.forEach((producto) => {
        div += `
            <p>Nombre: ${producto.title}</p>
            <p>Id: ${producto.id}</p>
            <p>Precio: ${producto.price}</p>
            <p>Descripcion: ${producto.description}</p>
            <p>Stock: ${producto.stock}</p>
            <p>Code: ${producto.code}</p>
            <button id="btnDelete" type="button" onclick = addProductToCart(${producto.id})>Eliminar</button>
            <hr>`;
      });
      productsDiv.innerHTML = div;
}

function addProductToCart(idProduct) {
    logger.info(idProduct);
}

renderProducts();
