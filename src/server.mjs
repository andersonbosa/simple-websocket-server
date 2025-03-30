import { WebSocketServer } from 'ws'

const { PORT = 8080 } = process.env
const timestamp = () => new Date().toISOString()

const clients = new Set()

const wss = new WebSocketServer({
    port: PORT,
    perMessageDeflate: {
        zlibDeflateOptions: { chunkSize: 1024, memLevel: 7, level: 3 },
        zlibInflateOptions: { chunkSize: 10 * 1024 },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
    }
})

wss.on('connection', (socket) => {
    clients.add(socket)
    console.log(timestamp(), `[INFO] Novo cliente conectado (${clients.size} online)`)

    socket.on('message', (data) => {
        console.log(timestamp(), `[RECEIVED] ${data}`)

        if (data === 'broadcast') {
            clients.forEach(client => {
                if (client !== socket && client.readyState === 1) {
                    client.send(`[Broadcast] ${data}`)
                }
            })
        }
    })

    socket.on('ping', () => {
        console.log(timestamp(), `[PING] Cliente ativo`)
        socket.pong()
    })

    socket.on('close', () => {
        clients.delete(socket)
        console.log(timestamp(), `[INFO] Cliente desconectado (${clients.size} online)`)
    })

    socket.on('error', (err) => {
        console.error(timestamp(), `[ERROR]`, err)
    })
})

wss.on('listening', () => {
    console.log(timestamp(), `[INFO] Servidor WebSocket escutando na porta ${PORT}`)
})