import { WebSocket } from "ws";

const { PORT = 8080 } = process.env;
const SERVER_URL = `ws://localhost:${PORT}`;

const timestamp = () => new Date().toISOString();

let socket = null;
let retryCount = 0;
const maxRetries = 10;

/**
 * Conecta ao servidor WebSocket
 * @returns {WebSocket}
 */
function connect() {
    console.log(timestamp(), `[INFO] Conectando ao WebSocket...`);
    const ws = new WebSocket(SERVER_URL);
    addListeners(ws);
    return ws;
}

/**
 * Adiciona listeners ao WebSocket
 * @param {WebSocket} ws
 */
function addListeners(ws) {
    ws.on("open", () => {
        console.log(timestamp(), "[INFO] Conectado ao WebSocket");
        retryCount = 0; // Reset da contagem de reconexões
        setInterval(() => ws.ping(), 5000);
    });

    ws.on("message", (event) => {
        console.log(timestamp(), "[RECEIVED]", event.toString());
    });

    ws.on("pong", () => {
        console.log(timestamp(), "[PONG] Cliente ativo");
    });

    ws.on("error", (error) => {
        console.error(timestamp(), "[ERROR]", error.message);
    });

    ws.on("close", () => {
        console.log(timestamp(), "[INFO] Conexão fechada. Tentando reconectar...");
        reconnect();
    });
}

/**
 * Lida com a reconexão automática
 */
function reconnect() {
    if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(() => {
            console.log(timestamp(), `[INFO] Tentativa ${retryCount}/${maxRetries}...`);
            socket = connect();
        }, 2000);
    } else {
        console.log(timestamp(), "[ERROR] Número máximo de tentativas atingido.");
    }
}

const sockets = Array.from({ length: 10 }).map(async (_, i) => connect())