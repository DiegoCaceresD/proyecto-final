import config from "../config/config.js";
import twilio from "twilio";
import logger from "../config/logger.js";

const twilioClient = twilio(
  config.twilioAccountSID,
  config.twilioAuthToken
);

const twilioSMSOptions = {
  body: "Esto es un mensaje SMS de prueba usando Twilio",
  from: config.twilioSmsNumber,
  to: config.twilioToSmsNumber,
};

export const sendSMS = async (req, res) => {
  try {
    logger.debug('Envio de SMS usando Twilio');
    logger.debug(twilioClient);
    const result = await twilioClient.messages.create(twilioSMSOptions)
    res.send({msg: 'Succes', payload: result})
  } catch (error) {
    logger.error.error(error);
    res.status(500).send({ error: error });
  }
};
