import IPv4LookupList from './IPv4LookupList'
import packetMonitor from './packetMonitor'

const packetMon = new packetMonitor([new IPv4LookupList('whitelist.json', 'whitelist'), new IPv4LookupList('blacklist.json', 'blacklist') ])

import express from 'express'
//import cors from 'cors'
import http from 'http'
import WebSocket from 'ws'
const app = express()
const port = 4000
// app.use(express.json())
// app.use(cors())

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

wss.on('connection', (client: WebSocket) => {
    clients.push(client)

    client.on('message', (message: string) => {
        const data = JSON.parse(message)
        console.log(data)
        if(data.action === 'stop') {
            packetMon.stop()
        }
        else if(data.action === 'start') {
            packetMon.start()
        }
        else if(data.action === 'reset') {
            packetMon.reset()
        }
        else if(data.stats) {
            let amount = isNaN(data.stats)||data.stats<=0?10:data.stats
            sendDataToAllClients({stats: packetMon.topStats(amount)})
        }
    })

    setInterval(() => {
        sendDataToAllClients({stats: packetMon.topStats(10)})
    }, 5000)

    client.on("close", () => {
        // remove client from clients
        clients = clients.filter(_client => _client !== client)
    })
})
