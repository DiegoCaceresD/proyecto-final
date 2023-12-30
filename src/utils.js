import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
import  logger  from "./config/logger.js";

export default __dirname;

//bcrypt
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user , password) =>{

    logger.info(`Datos a validar_ user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password);
}

//JWT
export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";
export const generateJWToken = (user) => {
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '120s'});
};


// Configuracion MULTER

const storage = multer.diskStorage(
    {
        // ubicaion del directorio donde voy a guardar los archivos
        destination: function (req, file, cb) {
            cb(null, `${__dirname}/public/img`)
        },

        // el nombre que quiero que tengan los archivos que voy a subir
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)

        }
    }
)
// este seria nuestro Middleware
export const uploader = multer({
    storage,
    // si se genera algun error, lo capturamos
    onError: function (error, next) {
        logger.error(error);
        next();
    }
});

faker.locale = 'es';

export const generateProducts = () => {
    return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    stock: faker.random.numeric(1),
    category: faker.commerce.department()
    }
};