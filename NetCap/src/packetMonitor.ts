import IPv4LookupList , {LookupResult} from './IPv4LookupList'
import Stats from './stats'
import pcap, {PcapSession} from 'pcap'
import util from 'util'
// @ts-ignore
import bogon from 'bogon'
import humanizeBytes from './humanizeBytes'

const DEFAULT_STAT_NAME = 'Gray area'

class packetMonitor {
    private lookupLists: IPv4LookupList[] = []
    private stats: Stats[] = []
    private pcapSession: PcapSession|undefined = undefined
    private startTime: Date|undefined = undefined

    constructor(lookupLists: IPv4LookupList[]) {
        this.lookupLists = lookupLists
        this.stats = [new Stats(DEFAULT_STAT_NAME)]
        lookupLists.forEach(list => {
            this.stats.push(new Stats(list.name))
        })
        this.startSession()
    }

    public start() {
        let started = false
        if(this.pcapSession === undefined) {
            this.startSession()
            started = true
        }
        return started
    }

    public stop() {
        let stopped = false
        if(this.pcapSession !== undefined)
        {
            this.stopSession()
            stopped = true
        }
        return stopped
    }

    public reset() {
        this.stopSession()
        this.stats = [new Stats(DEFAULT_STAT_NAME)]
        this.startSession()
    }

    private stopSession() {
        this.pcapSession?.close()
        this.pcapSession = undefined
    }

    private startSession() {
        this.startTime = new Date()

        this.pcapSession = pcap.createSession('eth0', {
            filter: 'ip proto \\tcp or ip proto \\udp'
        })
        
        this.pcapSession.on('packet', (rawPacket) => {
            const pcapPacket = pcap.decode.packet(rawPacket)
            //console.log(util.inspect(pcapPacket))
            const EthernetPacket = pcapPacket.payload
            const IpPacket = EthernetPacket.payload
            //console.log(util.inspect(IpPacket))
        
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
                this.lookupLists.forEach(list => {
                    let result: LookupResult = list.lookup(ip)
                    if(result.filterNames.length !== 0)
                    {
                        //console.log(`${ip} found in ${result.listName} named by filters ${result.filterNames}`)
                        this.stats.find(x=>x.name === result.listName)!.add(ip, result.filterNames, direction, protocol, length)
                        updated = true
                    }
                })
                if(!updated) {
                    this.stats.find(x=>x.name === DEFAULT_STAT_NAME)!.add(ip, [], direction, protocol, length)
                }
            }
            else {
                _stats.forEach(stat => {
                    this.stats.find(x=>x.name === stat.name)!.update(ip, direction, protocol, length)
                })
            }
        })
    }

    public topStats(amount: number) {
        let result: topStatList[] = []
        this.stats.forEach(list => {
            let topStats_to: topStat[] = []
            list.stats.sort((a,b)=>(b.TCP_to + b.UDP_to) - (a.TCP_to + b.UDP_to)).slice(0,amount).forEach(stat => {
                topStats_to.push({ip: stat.ip, data: humanizeBytes(stat.TCP_to + stat.UDP_to) })
            });
            let topStats_from: topStat[] = []
            list.stats.sort((a,b)=>(b.TCP_from + b.UDP_from) - (a.TCP_from + b.UDP_from)).slice(0,amount).forEach(stat => {
                topStats_from.push({ip: stat.ip, data: humanizeBytes(stat.TCP_from + stat.UDP_from) })
            });
            let topStatList: topStatList = {
                name: list.name,
                to: topStats_to,
                from: topStats_from
            }
            result.push(topStatList)
        })
        return result
    }
}
interface topStatList {
    name: string,
    to: topStat[]
    from: topStat[]
}
interface topStat {
    ip: string,
    data: string
}

export default packetMonitor