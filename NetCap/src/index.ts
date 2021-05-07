// sudo ip link set eth0 promisc on
const MAX_kbps = 1000000

import IPv4LookupList from './IPv4LookupList'
import packetMonitor from './packetMonitor'
import {BandwidthMonitor} from './bandwidthMonitor'
import axios from 'axios'

const monitor = new BandwidthMonitor()

monitor.on('data', data => {
    const bytespersecond = data.rx.bytespersecond
    const kbps = bytespersecond/125
    const percent = kbps/MAX_kbps*100
    const traffic = {
        bytespersecond,
        kbps,
        '%': percent
    }
    console.log(traffic)

    axios.post('http://localhost:3000', {'%': percent}, {headers: { 'Content-Type': 'application/json'}})
    .catch(() => {})
    sendDataToAllClients({bandwidth: percent})
})
monitor.run()

const packetMon = new packetMonitor([new IPv4LookupList('whitelist.json', 'Whitelist'), new IPv4LookupList('blacklist.json', 'Blacklist') ])

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
