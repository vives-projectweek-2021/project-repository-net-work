# Net-Work

## Team Members

* Seppe De Witte
* Dimi Catrysse
* Sirine Rajhi
* Emiel Coucke

## Project Analysis

### Capture Network Traffic

Who:

* Dimi
* Sirine

Materials:

* Raspberry Pi
* Switch

Why:

* Easy to capture realtime bandwidth
* Running capture software to collect most used IP addresses
* Running website to visualize the collected data + modify settings
* Switch is used to mirror the traffic from the exit interface to the router to the Raspberry Pi

### Led Strip

Who:

* Seppe
* Emiel

Materials:

* LED-strip with WS2812b Protocol

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