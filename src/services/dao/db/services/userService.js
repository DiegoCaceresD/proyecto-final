import userModel from "../models/user.model.js";
import logger from "../../../../config/logger.js";

export default class userService {
  constructor() {
    logger.debug("Working with user service");
  }

  getUsers = async () => {
    logger.info("Get users service");
    try {
      const response = await userModel.find();
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  deleteInactiveUsers = async () => {
    const dosDiasAtras = new Date();
    dosDiasAtras.setDate(dosDiasAtras.getDate() - 2);

    try {
      await userModel.deleteMany({ lastLogin: { $lt: dosDiasAtras } });
      logger.info("userService - Usuarios inactivos borrados con éxito.");
    } catch (error) {
      logger.error("Error al borrar usuarios:", error);
      throw error;
    }
  };

  getUserByCartId = async (cartId) => {
    try {
      const user = await userModel.findOne({ cart: cartId });
      return user;
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  };
}
