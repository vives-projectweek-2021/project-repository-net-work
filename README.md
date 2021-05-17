# Net-Work

[![Youtube image](https://img.youtube.com/vi/tUFfpEElehE/maxres1.jpg)](https://www.youtube.com/watch?v=tUFfpEElehE)

## Team Members

* Seppe De Witte
* Dimi Catrysse
* Sirine Rajhi
* Emiel Coucke

## Materials

* Raspberry Pi 4 (for real Gigabit Ethernet)
* Switch (capable of port mirroring)
* LED-strip (with WS2812b Protocol)

## Prerequisites

Be sure to install following packets:
```bash
apt install libpcap-dev
apt install sqlite3 libsqlite3-dev
```

Install vnstat version 2.6 from [here](https://github.com/vergoh/vnstat)

Run `npm install` in each subfolder execpt for the ledstrip_driver.  
To install the required files of the ledstrip, follow the steps in it's README.

Enable raw capturing data for node. More info can be found [here](https://www.blogging-it.com/node-pcap-module-error-socket-operation-not-permitted-fehler-wenn-pcapsession-geoeffnet-wird/programmierung/javascript/nodejs.html).  
This can be done with following command:  
```bash
sudo setcap 'cap_net_raw,cap_net_admin+eip' $(readlink -f $(which node))
```

## Running the final result

When not using the packet monitor, you must configure the ethernet interface in 'Promiscuous Mode'.
```bash
sudo ip link set eth0 promisc on
```

### WebSocket server

```bash
bash ./run_netcap_server.sh
```
This program must run first.

### NetCap bandwidth monitor

```bash
bash ./run_netcap_bandwidth.sh
```

### NetCap packet monitor

```bash
bash ./run_netcap_packet.sh
```

### Website

```bash
bash ./run_website.sh
```

### Ledstrip Driver

```bash
sudo bash ./run_ledstrip.sh
```
When not using sudo, the underlying library won't function to send data to the ledstrip.
