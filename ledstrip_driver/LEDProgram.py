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
LED_COUNT      = 16    # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (18 uses PWM!).
#LED_PIN        = 10      # GPIO pin connected to the pixels (10 uses SPI /dev/spidev0.0).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 10      # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 100    # Set to 0 for darkest and 255 for brightest
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
    if procent > 100:
        procent = 100
    percent(strip,Color(255,255,255),procent)

def percent(strip, color, data, wait_ms=2):
    """Wipe color across display a pixel at a time."""
    data = data*LED_COUNT/100
    data = int(data)
    print(data)
    for i in range(0,LED_COUNT):
        strip.setPixelColor(i, Color(0,0,0))
        #strip.show()
    
    for i in range(0,data):
        if(i < 7):
            #strip.setPixelColor(i, Color(0,0,0))
            strip.setPixelColor(i,Color(0,255,0))
        #strip.show()
        if(i >= 7 and i <= 11):
            
            #strip.setPixelColor(i, Color(0,0,0))
            strip.setPixelColor(i, Color(255,128,0))
        #strip.show()
        if(i > 11):
            #strip.setPixelColor(i, Color(0,0,0))
            strip.setPixelColor(i, Color(255,0,0))
        #strip.show()        
    strip.show()



        
        
            
    # if(data >= 1 and data <= 10):
    #     for i in range(0,int((LED_COUNT/100)*10)):
    #         strip.setPixelColor(i,Color(0,255,0))
    #         strip.show()
        

    # if(data >= 10 and data <= 20):
    #     for i in range(0,int((LED_COUNT/100)*20)):
    #         strip.setPixelColor(i, Color(0,255,0))
    #     strip.show()
        

    # if(data >= 20 and data <= 30):
    #     for i in range(0,int((LED_COUNT/100)*30)):
    #         strip.setPixelColor(i, Color(0,255,0))
    #     strip.show()
        

    # if(data >= 30 and data <= 40):
    #     for i in range(0,int((LED_COUNT/100)*40)):
    #         strip.setPixelColor(i, Color(0,255,0))
    #     strip.show()
       

    # if(data >= 40 and data <= 50):
    #     for i in range(0,int((LED_COUNT/100)*50)):
    #         strip.setPixelColor(i, Color(255,128,0))
    #     strip.show()
        

    # if(data >= 50 and data <= 60):
    #     for i in range(0,int((LED_COUNT/100)*60)):
    #         for j in range(0,int((LED_COUNT/100)*40)):
    #             strip.setPixelColor(j, Color(0,255,0))
    #         for k in range(int(LED_COUNT/100)*40,int(LED_COUNT/100)*60):
    #             strip.setPixelColor(k, Color(255,128,0))
    #     strip.show()
        

    # if(data >= 60 and data <= 70):
    #     for i in range(0,int((LED_COUNT/100)*70)):
    #         strip.setPixelColor(i, Color(255,128,0))
    #     strip.show()
        

    # if(data >= 70 and data <= 80):
    #     for i in range(0,int((LED_COUNT/100)*80)):
    #         strip.setPixelColor(i, Color(255,0,0))
    #     strip.show()
        

    # if(data >= 80 and data <= 90):
    #     for i in range (0,int((LED_COUNT/100)*90)):
    #         strip.setPixelColor(i, Color(255,0,0))
    #     strip.show()
        

    # if(data >= 90 and data <= 100):
    #     for i in range(0,int(LED_COUNT)):
    #         strip.setPixelColor(i, Color(255,128,0))
    #     strip.show()
    
        



if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-c', '--clear', action='store_true', help='clear the display on exit')
    args = parser.parse_args()
    strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
    strip.begin()
    run()


