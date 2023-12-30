import fs from "fs";
import logger from "../../../../config/logger.js";
import __dirname from "../../../../utils.js";

const requiredProperties = [
  "code",
  "title",
  "description",
  "price",
  "stock",
  "status",
  "category",
];

class Producto {
  constructor(
    title,
    description,
    price,
    thumbnails,
    code,
    stock,
    status,
    category
  ) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnails = thumbnails;
    this.code = code;
    this.stock = stock;
    this.status = status;
    this.category = category;
  }
}

class ProductManager {
  static id = 0; 
  #productos;
  #filePath;
  #dirPath;
  #fileSystem;
  constructor() {
    ProductManager.id;
    this.#productos = new Array();
    this.#dirPath = './file';
    this.#filePath = this.#dirPath + "/Products.json";
    this.#fileSystem = fs;
  }

  //vamos a trabajar con promesas por lo que necesito generar un ambiente asincronico
  addProduct = async (producto) => {
    let nuevoProducto = new Producto(
      producto.title,
      producto.description,
      producto.price,
      producto.thumbnails = producto.thumbnails? new Array(producto.thumbnails): undefined,
      producto.code,
      producto.stock,
      producto.status = true,
      producto.category
    );
    let invalidProp,nuevoId = 0;
    let nuevoProductoProperties = Object.keys(producto);
    logger.info("Nuevo producto: ", nuevoProducto);

    try {
      // creamos el directorio
      await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });

      //valido si ya existe el archivo con productos
      if (!this.#fileSystem.existsSync(this.#filePath)) {
        //le paso un array vacio en string porque write file recibe string
        await this.#fileSystem.promises.writeFile(this.#filePath, "[]");
      }

      // leo los productos encontrados
      let productos = await this.#fileSystem.promises.readFile(
        this.#filePath,
        "utf-8"
      );
      //parseo los productos y los agrego al array
      this.#productos = JSON.parse(productos);

      //busco el mayor de los id y le sumo 1 para asignarlo al nuevo producto
      this.#productos.forEach((producto) => {
        if (producto.id > nuevoId) {
          nuevoId = producto.id;
        }
      });

      //valido que el producto tenga las propiedades requeridas
      requiredProperties.forEach((i) => {
        if (!nuevoProductoProperties.includes(i)) {
          invalidProp = i;
        }
      });
      if (invalidProp != null) {
        throw  `Producto inválido, la propiedad ${invalidProp} es requerida`;
      }

      // agrego el nuevo producto al archivo
      this.#productos.push({
        ...nuevoProducto,
        id: nuevoId + 1,
      });

      await this.#fileSystem.promises.writeFile(
        this.#filePath,
        JSON.stringify(this.#productos, null, 2, "\t")
      );
    } catch (error) {
      logger.error(error);
      throw {status: 400, msg: error}
    }
  };

  getProducts = async () => {  
    try {
      let productos = await this.#fileSystem.promises.readFile(
        this.#filePath,
        "utf-8"
      );
      return productos;
    } catch (error) {
      logger.error("no se ha podido consultar al archivo");
      throw error
    }
  };

  getProductoById = async (id) => {
    let isProduct = false;
    let producto;
    try {
      let productos = await this.getProducts();

      this.#productos = JSON.parse(productos);
      this.#productos.forEach((element) => {
        if (element.id == id) {
          isProduct = true;
          producto = element;
        }
      });

      if (!isProduct) {
        throw `invalid id ${id}`;
      }
      return producto;

    } catch (error) {
      logger.error(error);
      throw {status: 400, msg: `Error al intentar consultar el id del producto - ${error}` }
    }
  };

  updateProduct = async (id, nuevaData) => {
    let productosActualizados = [];

    try {
      let isProduct = false;
      let productos = await this.getProducts();

      this.#productos = JSON.parse(productos);
      this.#productos.map((producto) => {
        if (producto.id == id) {
          isProduct = true;
          nuevaData.id = id;
          producto = nuevaData;
        }
        productosActualizados.push(producto);
      });

      await this.#fileSystem.promises.writeFile(
        this.#filePath,
        JSON.stringify(productosActualizados, null, 2, "\t")
      );
      if (!isProduct) throw `invalid id ${id}`;
    } catch (error) {
      logger.warning(`Error al intentar consultar el id del producto - ${error}`);
      throw {status:400, msg: `Error al intentar consultar el id del producto - ${error}`}
    }
  };

  deleteProduct = async (id) => {
    let productsFilter;
    try {
      let productos = await this.getProducts();

      this.#productos = JSON.parse(productos);
      productsFilter = this.#productos.filter(
        (productos) => productos.id != id
      );

      await this.#fileSystem.promises.writeFile(
        this.#filePath,
        JSON.stringify(productsFilter, null, 2, "\t")
      );
    } catch {
      logger.error("no se pudo eliminar el archivo");
    }
  };
}

export default ProductManager;
