import logger from "../config/logger.js";
import UserDTO from "../services/DTO/userDTO.js";
import { userService } from "../services/factory.js" 


export async function getUsers( req, res ) {
    logger.info("get users controller")
    try {
        let users = await userService.getUsers();
        let usersDTO = users.map(user => new UserDTO(user))
        return res.status(200).send({payload: usersDTO})
    } catch (error) {
        logger.error("error en get user controller", error.msg)
        res.status(500).send({ status: "error", msg: error });
    }
}

export async function deleteInactiveUsers (req,res) {
    try {
        await userService.deleteInactiveUsers();
        return res.status(200).send({status: "success", msg: "usuarios inactivos borrados con exito"})
    } catch (error) {
        res.status(500).json({ error: 'Error al borrar usuarios.' });
    }
}