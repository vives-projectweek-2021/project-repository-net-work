// sudo ip link set eth0 promisc on
const MAX_kbps = 1000000

import {BandwidthMonitor} from './bandwidthMonitor'
//import axios from 'axios'
const monitor = new BandwidthMonitor()

import WebSocket from 'ws'
const ws = new WebSocket(`ws://localhost:4000`)

monitor.on('data', data => {
    const bytespersecond = data.rx.bytespersecond
    const kbps = bytespersecond/125
    const percent =  kbps/MAX_kbps*100
    const traffic = {
        bytespersecond,
        kbps,
        '%': percent
    }
    console.log(traffic)

    /*
    axios.post('http://localhost:3000', {'%': percent}, {headers: { 'Content-Type': 'application/json'}})
    .catch(() => {})
    */
    sendWSData({bandwidth: percent.toFixed(2)})
})

monitor.run()
sendWSData({internal: true})

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