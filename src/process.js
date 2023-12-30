import { Command} from "commander";
import  logger  from "./config/logger.js";

const program = new Command();

program
.option('-d', 'Variable para debug', false)
.option('-p <port>', 'Puerto del server', 8080)
.option('--mode <mode>', 'Modo de trabajo' ,'develop')
.option('-u <user>', 'Usuario que va a utilizar la app', 'No se declaró ningun usuario')
program.parse() // parsea los commandos y valida que sean correctos

export default program