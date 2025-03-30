import readline from "readline";
import { sendMessage } from "./client.mjs";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("Digite uma mensagem para enviar pelo WebSocket. Digite 'exit' para sair.");

rl.on("line", (input) => {
    if (input.toLowerCase() === "exit") {
        console.log("Encerrando...");
        rl.close();
        process.exit(0);
    } else {
        sendMessage(input);
    }
});