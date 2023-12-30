import express from "express"
import logger from "../config/logger.js";

const router = express.Router();

router.get("/", async (req, res) => {
    
    logger.debug("Debug log test")
    logger.http("Http log test")
    logger.info("Info lof test")
    logger.warning("Warning log test")
    logger.error("Error log test")
    logger.fatal("Fatal log test")
    return res.send("Test ok")
});
export default router