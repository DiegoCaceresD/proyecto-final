import  config from "./config.js";
import mongoose from "mongoose";
import logger from "./logger.js";


export default class MongoSingleton {
    static #instance

    constructor(){
        this.#connectMongoDB()
    }

    static getInstance() {
        if(this.#instance){
            logger.warning("Ya se ha abierto una conexión a mongoDB");
        }else{
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    }

    #connectMongoDB = async () => {
        try {
            await mongoose.connect(config.mongoUrl)
            logger.info("Conectado con éxito a la DB");
        } catch (error) {
            logger.fatal("No se ha podido conectar a la DB usando Mongoose: ", error);
            process.exit(1);
        }
    }
}