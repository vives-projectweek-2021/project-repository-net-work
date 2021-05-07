interface Stat {
    ip: string,
    filterNames: string[],
    TCP_from: number,
    TCP_to: number,
    UDP_from: number,
    UDP_to: number
}

class Stats {
    public readonly name: string = ''
    public readonly stats: Stat[] = []

    constructor(name: string) {
        this.name = name
    }

    public contains(ip: string) {
        return this.stats.find(stat => stat.ip === ip)?true:false
    }

    public add(ip: string, filterNames: string[], direction: 'from'|'to', protocol: 'tcp'|'udp', length: number) {
        if(!this.contains(ip)) {
            let stat: Stat = {
                ip: ip,
                filterNames: filterNames,
                TCP_from: 0,
                TCP_to: 0,
                UDP_from: 0,
                UDP_to: 0
            }
            this.stats.push(stat)
        }
        this.update(ip, direction, protocol, length)
    }

    public update(ip: string, direction: 'from'|'to', protocol: 'tcp'|'udp', length: number) {
        if(!this.contains(ip)) {
            return
        }
        let stat = this.stats.find(stat => stat.ip === ip)!
        if(protocol === 'tcp' && direction==='from') {
            stat.TCP_from += length
        }
        else if(protocol === 'tcp' && direction === 'to') {
            stat.TCP_to += length
        }
        else if(protocol === 'udp' && direction==='from') {
            stat.UDP_from += length
        }
        else if(protocol === 'udp' && direction === 'to') {
            stat.UDP_to += length
        }
    }
}

export default Stats
export {Stat}