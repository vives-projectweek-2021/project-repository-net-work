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
* BreadBoard -> Later PCB-Design
* Mosfets voor grotere stroom
* 74AHCT125 IC

Why:

* The GPIO from the raspberry pi only gives a voltage of 3.3V and to send data to the ledstrip we need te convert this to a 5V voltage.
* To get a larger current we are going to use mosfets to power the ledstrips.
* To connect this all together we are going to make an PCB design because a breadboard is unreliable and the connections are more secure with an pcb design.
