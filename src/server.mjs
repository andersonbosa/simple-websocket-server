import { WebSocketServer } from 'ws'

const { PORT = 8080 } = process.env

const timestamp = () => new Date().toISOString()

const wss = new WebSocketServer({
    port: PORT,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed if context takeover is disabled.
    }
})

wss.on('connection', (socket) => {
    socket.on('message', (data) => {
        console.log(timestamp(), '[RECEIVED] %s', data)
    })
    socket.on('ping', (data) => {
        console.log(timestamp(), '[PING]', data.length)
        socket.pong()
    })
})


wss.on('close', () => {
    console.log(timestamp(), 'Conexão fechada')
})

wss.on('error', (err) => {
    console.error('Erro:', err)
})

wss.on('listening', () => {
    console.log(timestamp(), 'Servidor WebSocket escutando na porta %d', PORT)
})

wss.on('headers', (headers) => {
    console.log(timestamp(), 'Cabeçalhos:', headers)
})
