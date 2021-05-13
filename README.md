# Net-Work

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

## Running the final result

### WebSocket server

```bash
bash ./run_netcap_server.sh
```

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
