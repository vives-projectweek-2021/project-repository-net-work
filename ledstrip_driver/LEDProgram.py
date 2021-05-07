#!/usr/bin/env python3
# rpi_ws281x library strandtest example
import time
from rpi_ws281x import *
import argparse
import socket
import sys

from http.server import BaseHTTPRequestHandler, HTTPServer
import json

# LED strip configuration:
LED_COUNT      = 60   # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (18 uses PWM!).
#LED_PIN        = 10      # GPIO pin connected to the pixels (10 uses SPI /dev/spidev0.0).
LED_FREQ_HZ    = 802000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 10      # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 50    # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL    = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53
INPUT          = 0

class Server(BaseHTTPRequestHandler):
    # POST echoes the message adding a JSON field
    def do_POST(self):
        # refuse to receive non-json content
        if self.headers.get('content-type') != 'application/json' :
            self.send_response(400)
            self.end_headers()
            return
            
        # read the message and convert it into a python dictionary
        length = int(self.headers.get('content-length'), 0)
        post_data = self.rfile.read(length) # <--- Gets the data itself

        jdata = json.loads(post_data)
        DATA = jdata['%']
        if DATA:
            print(DATA)            
            displayProcent(DATA)
            # send the message back
            self.send_response(200)
            self.end_headers()
        else:
            # send the message back
            self.send_response(400)
            self.end_headers()
        
        
def run(server_class=HTTPServer, handler_class=Server, port=3000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    
    print('Starting httpd on port %d...' % port)
    httpd.serve_forever()

def displayProcent(procent):
    if procent >= 100:
        procent = 100
    percent(strip,Color(255,255,255),procent)

def percent(strip, color, data, wait_ms=2):
    """Wipe color across display a pixel at a time."""
    data = data*LED_COUNT/100
    data = int(data)
    print(data)
    # for i in range(0,LED_COUNT):
    #     strip.setPixelColor(i, Color(0,0,0))
    #     strip.show()
    
    for i in range(0,data):
        if(i < LED_COUNT/3):
            #strip.setPixelColor(i, Color(0,0,0))
            strip.setPixelColor(i,Color(0,255,0))
            strip.show()
            time.sleep(wait_ms/75)            

        #strip.show()
        if(i >= LED_COUNT/3 and i <= LED_COUNT-LED_COUNT/3):
            #strip.setPixelColor(i, Color(0,0,0))
            strip.setPixelColor(i, Color(255,128,0))
            strip.show()
            time.sleep(wait_ms/75)

        #strip.show()
        if(i > LED_COUNT-LED_COUNT/3):
            #strip.setPixelColor(i, Color(0,0,0))
            strip.setPixelColor(i, Color(255,0,0))
            strip.show()
            time.sleep(wait_ms/75)
        
    for i in range(0, LED_COUNT-data):
        strip.setPixelColor(LED_COUNT-i, Color(0,0,0))
        strip.show()
        time.sleep(wait_ms/100)
        
    strip.show()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-c', '--clear', action='store_true', help='clear the display on exit')
    args = parser.parse_args()
    strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
    strip.begin()
    run()

