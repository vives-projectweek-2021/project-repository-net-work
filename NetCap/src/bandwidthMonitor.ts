import { EventEmitter } from 'events'
import child_process from 'child_process'

export class BandwidthMonitor extends EventEmitter {

    process: child_process.ChildProcessWithoutNullStreams | null = null

    constructor() {
        super()
    }
    
    run() {
        this.process = child_process.spawn('stdbuf', ['-oL', 'vnstat', '--live', '--json'])
        this.process?.stdout.addListener('data', this.onData.bind(this))
    }
    isRunning() {
        return this.process != null
    }
    kill() {
        if(this.isRunning()) {
            this.process?.kill()
        }
    }

    private onData(data: any) {
      try{
        const jsonData = JSON.parse(data.toString())
        if(jsonData.rx && jsonData.tx) { 
          this.emit('data', jsonData)
        }
      }catch {}
    }
}

/*
{
  jsonversion: '1',
  vnstatversion: '2.6',
  interface: 'eth0',
  sampletime: 2
}
{
  index: 1,
  seconds: 2,
  rx: {
    ratestring: '45,39 kbit/s',
    bytespersecond: 5674,
    packetspersecond: 38,
    bytes: 11348,
    packets: 77,
    totalbytes: 11348,
    totalpackets: 77
  },
  tx: {
    ratestring: '11,08 kbit/s',
    bytespersecond: 1385,
    packetspersecond: 9,
    bytes: 2770,
    packets: 18,
    totalbytes: 2770,
    totalpackets: 18
  }
}
*/