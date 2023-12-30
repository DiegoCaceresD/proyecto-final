import { Router } from "express";
import passport from "passport";
import logger from "../config/logger.js";
import CustomRouter from "./custom/custom.router.js";
import { generateJWToken } from "../utils.js";
import userModel from "../services/dao/db/models/user.model.js";

const router = Router();

export default class SessionRouter extends CustomRouter {
  init() {
    //GITHUB
    this.get(
      "/github",
      ["PUBLIC"],
      passport.authenticate("github", { scope: ["user:email"] }),
      async (req, res) => {}
    );

    //githubcallback
    this.get(
      "/githubcallback",
      ["PUBLIC"],
      passport.authenticate("github", { failureRedirect: "/github/error" }),
      async (req, res) => {
        const user = req.user;
        req.session.user = {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          age: user.age,
        };
        logger.info(req.session.user);
        req.session.admin = true;
        res.redirect("/users");
      }
    );

    this.post(
      "/register",
      ["PUBLIC"],
      passport.authenticate("register", {
        failureRedirect: "/api/sessions/fail-register",
      }),
      async (req, res) => {
        logger.info("Usuario registrado exitosamente");
        res.sendCreated(
          `Usuario: ${req.user.first_name} ${req.user.last_name}`
        );
      }
    );

    this.post(
      "/login",
      ["PUBLIC"],
      passport.authenticate("login", {
        failureRedirect: "/api/sessions/fail-login",
      }),
      async (req, res) => {
        const user = req.user;
        logger.info("User found to login: ", user._doc);
        if (!user) {
          logger.warning("Credenciales incorrectas");
          CustomError.createError({
            name: "User Login",
            cause: "Credenciales incorrectas",
            code: EErrors.INVALID_CREDENTIALS,
            message: user,
          });
        }
        const useraux = {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          age: user.age,
          role: user.role,
        };
        const tokenUser = useraux;

        const access_token = generateJWToken(tokenUser);

        res.cookie("jwtCookieToken", access_token, {
          maxAge: 60000,
          httpOnly: true, // No se expone la cookie
          // httpOnly: false // expone la cookie
        });

        req.session.user = useraux;
        logger.info("Usuario loggeado exitosamente");

        res.send({
          status: "success",
          payload: req.session.user,
          message: "Loggeado exitosamente",
        });
      }
    );

    this.get("/fail-register", ["PUBLIC"], (req, res) => {
      res.sendUnauthorizedError("Failed to process register");
    });

    this.get("/fail-login", ["PUBLIC"], (req, res) => {
      res.sendUnauthorizedError("Failed to process login");
    });
  }
}
