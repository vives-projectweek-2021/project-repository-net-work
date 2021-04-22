import pcap from 'pcap'
import util from 'util'

const session = pcap.createSession('eth0', {
    filter: 'ip proto \\tcp or ip proto \\udp'
})

let stat: any = []

session.on('packet', (rawPacket) => {
    let data: any = []
    const pcapPacket = pcap.decode.packet(rawPacket)
    //console.log(util.inspect(pcapPacket))
    const EthernetPacket = pcapPacket.payload
    const IpPacket = EthernetPacket.payload

    const length = IpPacket.length
    const dest = IpPacket.daddr.toString()
    const src = IpPacket.saddr.toString()
    const stream = src + '->' + dest
    const type = Object.getPrototypeOf(IpPacket.payload).decoderName
    if (type == 'udp') {
        const update = (stat[stream]??{udp: 0, tcp: 0})
        update.udp = update.udp + length
        stat[stream] = update
    }
    else if (type == 'tcp') {
        const update = (stat[stream]??{udp: 0, tcp: 0})
        update.tcp = update.tcp + length
        stat[stream] = update
    }
    //console.log({dest, length: stat[dest]}) 
    //console.log(util.inspect(IpPacket))

})

setInterval(()=> {
    console.clear()
    console.log(stat)
},1000)

