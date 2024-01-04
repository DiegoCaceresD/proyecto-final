import config from "../config/config.js";
import logger from "../config/logger.js";
import MongoSingleton from "../config/mongodb-singleton.js";

let productsService
let cartsService
let ticketService
let userService

async function initializeMongoService() {
  logger.debug("Iniciando servicio para MongoDB");
  try {
    // conectamos Mongo
    await MongoSingleton.getInstance()

    // Creamos las instancias de las Clases de DAO de Mongo
    const { default: ProductsServiceMongo } = await import('./dao/db/services/productService.js');
    productsService = new ProductsServiceMongo();
    logger.debug("Servicio de products cargado: ", productsService);

    const { default: CartsServiceMongo } = await import('./dao/db/services/cartsService.js');
    cartsService = new CartsServiceMongo();
    logger.debug("Servicio de carts cargado: ", cartsService);

    const { default: TicketServiceMongo } = await import('./dao/db/services/ticketService.js');
    ticketService = new TicketServiceMongo();
    logger.debug("Servicio de ticket cargado: ", ticketService);

    const { default: UserServiceMongo } = await import('./dao/db/services/userService.js');
    userService = new UserServiceMongo();
    logger.debug("Servicio de user cargado: ", userService);


} catch (error) {
    logger.error("Error al iniciar MongoDB: ", error);
    process.exit(1); // Salir con código de error
}
}

switch (config.persistence) {
  case "mongodb":
    initializeMongoService();
    break;
  case "files":
    const { default: ProductServiceFileSystem } = await import("./dao/fileSystem/models/ProductManager.js");
    productsService = new ProductServiceFileSystem();
    logger.debug("Servicio de courses cargado: ", productsService);

    const { default: CartsServiceFileSystem } = await import("./dao/fileSystem/models/Carrito.js");
    cartsService = new CartsServiceFileSystem();
    logger.debug("Servicio de carts cargado: ", cartsService);

    const { default: TicketServiceFileSystem } = await import('./dao/fileSystem/services/TicketService.js');
    ticketService = new TicketServiceFileSystem();
    logger.debug("Servicio de ticket cargado:", ticketService);

    const { default: UserServiceFileSystem } = await import('./dao/fileSystem/services/userService.js');
    ticketService = new UserServiceFileSystem();
    logger.debug("Servicio de user cargado:", userService);

    break;

  default:
    logger.error("Persistenciaa no válida en la configuración: ",config.persistence);
    process.exit(1);
}

export { productsService, cartsService, ticketService, userService };
