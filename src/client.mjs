import { WebSocket } from "ws"

const { PORT = 8080 } = process.env

const connect = () => new WebSocket(`ws://localhost:${PORT}`)

const timestamp = () => new Date().toISOString()

/**
 * @param {WebSocket} wSocket 
 * @returns WebSocket
 */
function addListeners(wSocket) {
    wSocket.on('message', (event) => {
        console.log(timestamp(), 'Mensagem recebida:', event.data)
    })
    wSocket.on('open', (ws) => {
        console.log(timestamp(), 'Conectado ao servidor WebSocket')
        setInterval(() => { wSocket.ping() }, 1000)
    })
    wSocket.on('pong', (data) => {
        console.log(timestamp(), '[PONG]', data.length)
    })
    wSocket.on('error', (error) => {
        console.error('Erro:', error)
    })
    wSocket.on('close', () => {
        console.log(timestamp(), 'Conexão fechada')
        let retryCount = 0
        const maxRetries = 10
        const retryInterval = setInterval(() => {
            if (retryCount < maxRetries) {
                retryCount++
                console.log(timestamp(), `Tentativa de reconexão ${retryCount} de ${maxRetries}`)
                const newSocket = connect()
                newSocket.on('open', () => {
                    clearInterval(retryInterval)
                    console.log(timestamp(), 'Reconectado ao servidor WebSocket')
                    addListeners(newSocket)
                })
                return newSocket
            }
            clearInterval(retryInterval)
            console.log(timestamp(), 'Número máximo de tentativas atingido')
        }, 1000)
    })
    return wSocket
}

const socket = connect()
addListeners(socket)
