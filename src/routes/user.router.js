import express from "express"
import * as UserController from "../controllers/userController.js"

const router = express.Router();

router.get("/", UserController.getUsers);
router.delete("/deleteInactiveUsers", UserController.deleteInactiveUsers)

export default router;