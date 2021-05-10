import IPv4LookupList from './IPv4LookupList'
import packetMonitor from './packetMonitor'

const packetMon = new packetMonitor([new IPv4LookupList('whitelist.json', 'Whitelist'), new IPv4LookupList('blacklist.json', 'Blacklist') ])

import WebSocket from 'ws'
const ws = new WebSocket(`ws://localhost:4000`)

ws.addEventListener('message', message => {
    const data = JSON.parse(message.data)
    console.log(data)
    if(data.action === 'stop') {
        packetMon.stop()
    }
    else if(data.action === 'start') {
        packetMon.start()
    }
    else if(data.action === 'reset') {
        packetMon.reset()
        sendWSData({stats: packetMon.topStats(amount)})
    }
    else if(data.stats && !isNaN(data.stats)) {
        let newAmount = data.stats
        newAmount = newAmount<0?10:newAmount
        newAmount = newAmount>50?50:newAmount
        amount = newAmount
        sendWSData({stats: packetMon.topStats(amount)})
    }
})

sendWSData({internal: true})

let amount = 10
setInterval(() => {
    if(packetMon.isRunning())
    {
        sendWSData({stats: packetMon.topStats(amount)})
    }
}, 5000)

function sendWSData(data: any) {
    if(ws.readyState === 1) {
        ws.send(JSON.stringify(data))
    } else {
        const retryInterval = setInterval( () => {
        if(ws.readyState)
        {
            ws.send(JSON.stringify(data))
            clearInterval(retryInterval)
        }
        }, 100)
    }
}