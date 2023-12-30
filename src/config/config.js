import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program
  .option("-d", "Variable para debug", false)
  .option("--persist <mode>", "Modo de persistencia", "mongodb")
  .option("-p <port>", "Puerto del servidor", 8080)
  .option("--mode <mode>", "Modo de trabajo", "develop");
program.parse();

const environment = program.opts().mode;
dotenv.config({
  path:
    environment === "production"
      ? "./src/config/.env.production"
      : "./src/config/.env.development",
});

export default {
  environment: environment,
  port: process.env.PORT,
  mongoUrl: process.env.URL_MONGO,
  persistence: program.opts().persist,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PROCESS,
  gmailAccount: process.env.GMAIL_ACCOUNT,
  gmailAppPassword: process.env.GMAIL_APP_PASSWD,
  twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioSmsNumber: process.env.TWILIO_SMS_NUMBER,
  twilioToSmsNumber: process.env.TWILIO_TO_SMS_NUMBER,
};
