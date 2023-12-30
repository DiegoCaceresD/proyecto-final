import fs from "fs";
import ProductManager from "../models/ProductManager.js";
import __dirname from "../../../../utils.js";

class Carrito {
  constructor() {
    this.productos = new Array();
  }
}

class CarritoManager {
  #carritos;
  #filePath;
  #dirPath;
  #fileSystem;
  constructor() {
    this.#carritos = new Array();
    this.#dirPath = "./file"; 
    this.#filePath = this.#dirPath + "/Carritos.json";
    this.#fileSystem = fs;
  }
  addCarrito = async () => {
    let nuevoCarrito = new Carrito();
    let nuevoId = 0;
    try {
      // creamos el directorio
      await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
      //valido si ya existe el archivo con productos
      if (!this.#fileSystem.existsSync(this.#filePath)) {
        await this.#fileSystem.promises.writeFile(this.#filePath, "[]");
      }

      // leo los productos encontrados
      let carritos = await this.#fileSystem.promises.readFile(
        this.#filePath,
        "utf-8"
      );
      //parseo los productos y los agrego al array
      this.#carritos = JSON.parse(carritos);

      this.#carritos.forEach((carrito) => {
        if (carrito.id > nuevoId) {
          nuevoId = carrito.id;
        }
      });
      // agrego el nuevo producto al archivo
      this.#carritos.push({
        id: nuevoId + 1,
        ...nuevoCarrito,
      });

      await this.#fileSystem.promises.writeFile(
        this.#filePath,
        JSON.stringify(this.#carritos, null, 2, "\t")
      );
    } catch (error) {
      throw {status: 400, msg: error}
    }
  };

  getCarritoById = async (id) => {
    let isCart = false;
    let carrito;
    try {
      let carts = await this.#fileSystem.promises.readFile(
        this.#filePath,
        "utf-8"
      );

      this.#carritos = JSON.parse(carts);
      this.#carritos.forEach((element) => {
        if (element.id == id) {
          isCart = true;
          carrito = element;
        }
      });
      if (!isCart) {
        throw `invalid id ${id}`;
      }
      return carrito;
    } catch (error) {
      throw {
        status: 400,
        msg: `Error al intentar consultar el id inexistente - ${error}`,
      };
    }
  };

  addProductTocartById = async (cid, pid) => {
    let productManager = new ProductManager();
    let carritosActualizados = new Array();
    try {
      let carrito = await this.getCarritoById(cid);
      let productos = await productManager.getProductos();
      let allCarts = await this.#fileSystem.promises.readFile(
        this.#filePath,
        "utf-8"
      );
      productos = JSON.parse(productos);
      this.#carritos = JSON.parse(allCarts);

      //valido que el producto exista y si existe lo agrego al carrito
      let producto = productos.find( i => i.id == pid)

      //si el productoId ya existe le sumo uno a quantity
        carrito.productos.forEach((p)=>{
        if (producto) {
          if (p.productoId == pid) {
            p.quantity+=1
          }
        }else{
          throw`Producto no existe`
        }
      })
    
      //Si el producto ID no existe hago push del productoId y de quantity 1
    let isPorductoinCart = carrito.productos.find((p)=> p.productoId == pid)
      if (!isPorductoinCart) {
        carrito.productos.push({productoId: pid, quantity: 1})
      }

      //filto los carritos que no tienen el id solicitado para despues concatearlos con el nuevo carrito
      let cartsNotId = this.#carritos.filter((i) => i.id !== cid);

      carritosActualizados.push(...cartsNotId,carrito);


      //sobreescribo el archivo con los carritos actualizados
      await this.#fileSystem.promises.writeFile(
        this.#filePath,
        JSON.stringify(carritosActualizados, null, 2, "\t")
      );

    } catch (error) {
      logger.error("error: ", error);
      throw {status: 400, msg: error}
    }
  };
}

export default CarritoManager;
