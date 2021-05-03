import IPv4LookupList , {LookupResult}from './IPv4LookupList'
import Stats , {Stat}from './stats'
import pcap, {PcapSession} from 'pcap'
import util from 'util'
// @ts-ignore
import bogon from 'bogon'

const lookupLists: IPv4LookupList[]  = [new IPv4LookupList('whitelist.json', 'whitelist'), new IPv4LookupList('blacklist.json', 'blacklist') ]
let stats: Stats[] = [new Stats('unknown')]
lookupLists.forEach(list => {
    stats.push(new Stats(list.name))
})

let session: PcapSession|undefined = undefined
function startSession() {
    session = pcap.createSession('eth0', {
        filter: 'ip proto \\tcp or ip proto \\udp'
    })
    
    session.on('packet', (rawPacket) => {
        const pcapPacket = pcap.decode.packet(rawPacket)
        //console.log(util.inspect(pcapPacket))
        const EthernetPacket = pcapPacket.payload
        const IpPacket = EthernetPacket.payload
    
        const length = IpPacket.length
        const dest = IpPacket.daddr.toString()
        const src = IpPacket.saddr.toString()
    
        const srcPrivate = bogon.isPrivate(src)
        const destPrivate = bogon.isPrivate(dest)
        const srcBogon = bogon.isBogon(src)
        const destBogon = bogon.isBogon(dest)
    
        const protocol = Object.getPrototypeOf(IpPacket.payload).decoderName
        let direction: 'to'|'from' = 'to'
        let ip: string = ''
        if(srcBogon&&destBogon) {
            return
        }
        else if(srcPrivate && !destPrivate) {
            ip = dest
        }
        else if(!srcPrivate && destPrivate) {
            ip = src
            direction = 'from'
        }
    
        let _stats: Stats[] = []
        _stats.forEach(stat => {
            if(stat.contains(ip))
            {
                _stats.push(stat)
            }
        })
        if(_stats.length === 0) {
            let updated = false
            lookupLists.forEach(list => {
                let result: LookupResult = list.lookup(ip)
                if(result.filterNames.length !== 0)
                {
                    //console.log(`${ip} found in ${result.listName} named by filters ${result.filterNames}`)
                    stats.find(x=>x.name === result.listName)!.add(ip, result.filterNames, direction, protocol, length)
                    updated = true
                }
            })
            if(!updated) {
                stats.find(x=>x.name === 'unknown')!.add(ip, [], direction, protocol, length)
            }
        }
        else {
            _stats.forEach(stat => {
                stats.find(x=>x.name === stat.name)!.update(ip, direction, protocol, length)
            })
        }
    })
}
startSession()

import express from 'express'
import cors from 'cors'
const app = express()
const port = 4000
app.use(express.json())
app.use(cors())
app.get('/stats', (req, res) => {
    res.json(stats)
})
app.post('/start', (req, res) => {
    let started = false
    if(session === undefined) {
        startSession()
        started = true
    }
    res.json({started})
})
app.post('/stop', (req, res) => {
    let stopped = false
    if(session !== undefined)
    {
        session.close()
        session = undefined   
        stopped = true
    }
    res.json({stopped})
})
app.listen(port, ()=> {
    console.log('listening')
})
