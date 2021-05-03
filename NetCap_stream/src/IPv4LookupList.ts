import fs from 'fs'
import { getMatch } from 'ip-matching'
import { resolve } from 'path'

interface IP_Filter {
    name: string,
    ranges: string[]
}
interface LookupResult {
    listName: string,
    filterNames: string[]
}

class IPv4LookupList {
    private filterList: IP_Filter[] = []
    public readonly name: string = ''

    constructor(path: string, name: string) {
        this.name = name
        if (!fs.existsSync(path)) {
            throw new Error(`Invalid path for '${name}'\n\t'${resolve(path)}' does not exists`)
        }
        let filterList: any
        try {
            filterList = JSON.parse(fs.readFileSync(path).toString())
        }catch(e) {
            throw new Error(`${(e as Error).message}\n\tin '${name}'\n\tat '${resolve(path)}'`)
        }
        Object.keys(filterList).forEach(filterName => {
            const IPlist: string[] = filterList[filterName]
            let ranges: string[] = []
            IPlist.forEach(range=>{
                try {
                    const match = getMatch(range)
                    ranges.push(match.input)
                }
                catch(e) {
                    throw new Error(`Invalid IP (range/subnetwork) named '${range}'\n\tin filter '${filterName}'\n\tin '${name}'\n\tstored at '${resolve(path)}'`)
                }
            })
            if(ranges.length!==0) {
                this.filterList.push({name: filterName, ranges})
            }
        })
    }

    public lookup(ip: string): LookupResult {
        let result: LookupResult = { listName: this.name, filterNames: [] }
        this.filterList.forEach(list => {
            list.ranges.forEach(range => {
                if(getMatch(range).matches(ip)) {
                    result.filterNames.push(list.name)
                }
            })
        })
        return result
    }
}

export default IPv4LookupList
export {LookupResult}