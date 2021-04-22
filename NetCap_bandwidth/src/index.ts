// sudo ip link set eth0 promisc on
const MAX_kbps = 600000

import {BandwidthMonitor} from './bandwidthMonitor'
import axios from 'axios'
const monitor = new BandwidthMonitor()

monitor.on('data', data => log(data))
monitor.run()

function log(data: any) {
    const bytespersecond = data.rx.bytespersecond
    const kbps = bytespersecond/125
    const traffic = {
        bytespersecond,
        kbps,
        '%': kbps/MAX_kbps*100
    }
    console.log(traffic)

    axios.post('http://localhost:3000', {'%': kbps/MAX_kbps*100}, {headers: { 'Content-Type': 'application/json'}})
    .catch(() => {})
}
