import axios from 'axios'

import express from 'express'
import http from 'http'
import WebSocket from 'ws'
const app = express()
const port = 4000
const server = http.createServer(app)
const wss = new WebSocket.Server({server})

server.listen(port, () => {
    console.log("Listening on port " + port)
})

let clients: Array<WebSocket> = []
function sendDataToAllClients(data: object) {
    clients.forEach(client => {
        sendDataToClient(client, data)
    });
}
function sendDataToClient(client: WebSocket, data: object) {
    client.send(JSON.stringify(data))
}

let internal: Array<WebSocket> = []
function sendInternalData(data: object) {
    internal.forEach(client => {
        client.send(JSON.stringify(data))
    });
}

wss.on('connection', (client: WebSocket) => {
    clients.push(client)

    client.on('message', (message: string) => {
        const data = JSON.parse(message)
        console.log(data)
        if(data.internal) {
            // replace client from clients to internal
            clients = clients.filter(_client => _client !== client)
            internal.push(client)
            return
        }
        if(internal.includes(client)) {
            sendDataToAllClients(data)
            if(data.bandwidth) {
                axios.post('http://localhost:3000', {'%': parseFloat(data.bandwidth)}, {headers: { 'Content-Type': 'application/json'}})
                .catch(() => {})
            }
        } else if(clients.includes(client)) {
            sendInternalData(data)
        }
    })

    client.on("close", () => {
        // remove client from clients
        clients = clients.filter(_client => _client !== client)
        // remove client from internal
        internal = internal.filter(_client => _client !== client)
    })
})
