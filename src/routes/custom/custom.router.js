import { Router } from "express";
import Jwt from "jsonwebtoken";
import logger from "../../config/logger.js";
import { PRIVATE_KEY } from "../../utils.js";

export default class CustomRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {}

  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handelPolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  post(path,policies, ...callbacks) {
    this.router.post(
      path,
      this.handelPolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  put(path,policies, ...callbacks) {
    this.router.put(
      path,
      this.handelPolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }
  delete(path,policies, ...callbacks) {
    this.router.delete(
      path,
      this.handelPolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }


  handelPolicies = (policies) => (req, res, next) => {
    logger.info("Politicas a evaluar: ", policies);
    if (policies[0] === "PUBLIC") {
      return next();
    }

    //El JWT token se guarda en los headers de autorización.
    const authHeader = req.headers.authorization;
    logger.debug("req: ", req.headers);
    logger.debug("Token present in header auth: ", authHeader);
    if (!authHeader) {
      return res
        .status(401)
        .send({ error: "User not authenticated or missing token." });
    }
    const token = authHeader.split(" ")[1]; //Se hace el split para retirar la palabra Bearer.
    //Validar token
    Jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
      if (error)
        return res.status(403).send({ error: "Token invalid, Unauthorized!" });
      //Token OK
      req.user = credentials.user;
      logger.debug("metodo-authToken req.user: ", req.user);
      if(!policies.includes(user.role.toUpperCase())) return res.sendForbiddenError("El rol con el que intenta ingresar no cuenta con los privilegios suficientes")
      
      req.user = user;
      logger.info("user: ",req.user);
      next();
    });
  };

  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = (payload) =>res.status(200).send({ status: "Success", payload });
    res.sendCreated = (payload) =>res.status(201).send({ status: "User created successfully", payload });
    res.sendClientError = (error) =>res.status(400).send({ status: "Client Error, Bad request from client.", error });
    res.sendUnauthorizedError = (error) =>res.status(401).send({ error: "User not authenticated or missing token.", error });
    res.sendForbiddenError = (error) =>res.status(403).send({error:"Token invalid or user with no access, Unauthorized please check your roles!",error,});
    res.sendnotFoundError = (error) =>res.status(404).send({ error: "Not Found", error });
    res.sendInternalServerError = (error) =>res.status(500).send({ status: "Error", error });
    next();
  };

  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        logger.error(error);
        params[1].status(500).send(error);
      }
    });
  }
}
