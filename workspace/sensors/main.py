#!/usr/bin/python3
import time
import serial
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import threading
import requests

## FastAPI server config
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # Allow requests from any domain
    allow_credentials=True, # Allow credentials (cookies, etc.)
    allow_methods=["*"],    # Allow all HTTP methods
    allow_headers=["*"],    # Allow all headers
)

## Start Serial
serial_port = serial.Serial(
    port="/dev/ttyTHS1",
    baudrate=115200,
    bytesize=serial.EIGHTBITS,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
)
# Wait a second to let the port initialize
time.sleep(1)
json_data = ""

@app.get("/")
async def root():
	return {"result": "Hello World", "error": ""}

@app.get("/sensors")
async def sensors():
	global json_data
	return {"result": json_data, "error": ""}

@app.get("/buzzerON")
async def buzzerON():
    serial_port.write("0".encode())
    return {"result": "ok", "error": ""}

@app.get("/buzzerOFF")
async def buzzerOFF():
	serial_port.write("1".encode())
	return {"result": "ok", "error": ""}

@app.get("/lightWhite")
async def lightWhite():
	serial_port.write("2".encode())
	return {"result": "ok", "error": ""}

@app.get("/lightYellow")
async def lightWhite():
	serial_port.write("4".encode())
	return {"result": "ok", "error": ""}

@app.get("/lightRed")
async def lightWhite():
	serial_port.write("5".encode())
	return {"result": "ok", "error": ""}

class BackgroundTasks(threading.Thread):
	def run(self,*args,**kwargs):
		global json_data
		dataframe = ""
		serial_port.write("1".encode()) # Turn off the buzzer
		time.sleep(0.5)
		serial_port.write("2".encode())	# Set Light White
		time.sleep(0.5)
		counter = 0
		while True:
			if serial_port.inWaiting() > 0:
				data = serial_port.read()
				dataframe = dataframe + data.decode()
				if(data == '}'.encode() and dataframe.find('{') >= 0): 
					dataframe = dataframe[dataframe.find('{'):dataframe.find('}') + 1]
					json_data = json.loads(dataframe)
					serial_port.flush()
					dataframe = ""
					counter = counter + 1
			if counter == 10 * 6: # Every 1 minute
				counter = 0
				url = "https://URL.cloudfunctions.net/putSensorData"
				payload = json.dumps({
					"cubeId": "00001",
					"data": json_data
				})
				headers = {
					'Content-Type': 'application/json'
				}
				requests.request("POST", url, headers=headers, data=payload)


@app.on_event("startup")
async def startup_event():
	t = BackgroundTasks()
	t.start()