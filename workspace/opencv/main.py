import io
import cv2
import base64 
import numpy as np
from PIL import Image
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # To handle CORS for cross-origin requests, like API calls from other
import mediapipe as mp
import time
from threading import Thread
import requests

## Constants

confidence_threshold = 0.6
confidence_threshold_min = 0.4
objects = [
  "knife",
  "baseball bat",  
  "bottle",
]
min_width = 0

# Globals

## Responses
response = {"result": "Hello From API", "error": None}
feed = ""

## Classes
class ThreadedCamera(object):
    def __init__(self, source = 0):
        self.capture = cv2.VideoCapture(source)
        time.sleep(1)
        self.thread = Thread(target = self.update, args = ())
        self.thread.daemon = True
        self.thread.start()
        self.status = False
        self.frame  = None
        

    def update(self):
        global feed
        while True:
            if self.capture.isOpened():
                (self.status, self.frame) = self.capture.read()
                feed = imageToString(self.frame)

    def grab_frame(self):
        if self.status:
            return self.frame
        return None
    def stop(self):
        self.running = False  # Set the running flag to False
        self.capture.release()  # Release the camera
        self.thread.join()  # Wait for the thread to finish
        
class ThreadedModel(Thread):
	def run(self,*args,**kwargs):
		global response
		while True:
			cv2_image = video_capture.grab_frame()
			if cv2_image is not None:
				height, width, _ = cv2_image.shape
				_, outputs = detect_objects(cv2_image, model, output_layers)
				boxes, confs, class_ids = get_box_dimensions(outputs, height, width)
				yolo= draw_labels(boxes, confs, colors, class_ids, classes, cv2_image)
				poses, fallenFlags = draw_poses(boxes, confs, class_ids, classes, cv2_image)
				labels = get_labels(boxes, confs, class_ids, classes)
				json = {
					"imageYolo": imageToString(yolo),
					"imagePoses": imageToString(poses),
					"detections": labels,
					"risky": contains_any_element(labels,objects),
					"fallen": fallenFlags.count(True)>0
				}
				if(contains_any_element(labels,objects)):
					requests.request("GET", "http://localhost:3001/lightRed", headers={}, data={})
				elif(fallenFlags.count(True)>0):
					requests.request("GET", "http://localhost:3001/lightYellow", headers={}, data={})
				else:
					requests.request("GET", "http://localhost:3001/lightWhite", headers={}, data={})
				response = json
     
###### FUNCTIONS #######

def contains_any_element(arr1, arr2):
    return any(element in arr1 for element in arr2)

def stringToImage(base64_string):
    imgdata = base64.b64decode(base64_string)
    pil_image = Image.open(io.BytesIO(imgdata))
    return cv2.cvtColor(np.array(pil_image), cv2.COLOR_BGR2RGB)

def imageToString(image):
    _, buffer = cv2.imencode('.jpg', image)
    imgdata = base64.b64encode(buffer)
    return imgdata

def load_yolo():
	net = cv2.dnn.readNet("yolov7x.weights", "yolov7x.cfg")
	classes = []
	with open("coco.names", "r") as f:
		classes = [line.strip() for line in f.readlines()] 
	output_layers = [layer_name for layer_name in net.getUnconnectedOutLayersNames()]
	colors = np.random.uniform(0, 255, size=(len(classes), 3))
	return net, classes, colors, output_layers

def detect_objects(img, net, outputLayers):			
	blob = cv2.dnn.blobFromImage(img, scalefactor=1/255, size=(608, 608), mean=(0, 0, 0), swapRB=True, crop=False)
	net.setInput(blob)
	outputs = net.forward(outputLayers)
	return blob, outputs

def draw_labels(boxes, confs, colors, class_ids, classes, img):
	imgCopy = img.copy()
	indexes = cv2.dnn.NMSBoxes(boxes, confs, confidence_threshold, confidence_threshold_min)
	font = cv2.FONT_HERSHEY_PLAIN
	labels = []
	for i in range(len(boxes)):
		if i in indexes:
			x, y, w, h = boxes[i]
			label = str(classes[class_ids[i]])
			color = colors[i]
			cv2.rectangle(imgCopy, (x,y), (x+w, y+h), color, 2)
			cv2.putText(imgCopy, label, (x, y - 5), font, 1, color, 1)
			labels.append(label)
	return imgCopy

def detect_pose(img, pose,mpDraw, mpPose):
    imgCopy = img.copy()	
    results = pose.process(imgCopy)
    xs = []
    ys = []
    delta_x = 0
    delta_y = 1
    if results.pose_landmarks:
        mpDraw.draw_landmarks(imgCopy, results.pose_landmarks, mpPose.POSE_CONNECTIONS)
        for _, lm in enumerate(results.pose_landmarks.landmark):
            h, w, _ = imgCopy.shape
            cx, cy = int(lm.x*w), int(lm.y*h)
            cv2.circle(imgCopy, (cx, cy), 5, (255,0,0), cv2.FILLED)
            xs.append(cx)
            ys.append(cy)
        delta_x = max(xs) - min(xs)
        delta_y = max(ys) - min(ys)
        print(delta_x, delta_y, delta_x > delta_y)
    return imgCopy, delta_x > delta_y

def draw_poses(boxes, confs, class_ids, classes, img):
    imgCopy = img.copy()
    indexes = cv2.dnn.NMSBoxes(boxes, confs, confidence_threshold, confidence_threshold_min)
    fallenFlags = []
    for i in range(len(boxes)):
        if i in indexes:
            x, y, w, h = boxes[i]
            if x< 0:
                x = 0
            if y< 0:
                y = 0
            label = str(classes[class_ids[i]])
            if label == "person":
                person = img[y:y+h, x:x+w]
                imgCopy[y:y+h, x:x+w], fallen = detect_pose(person, pose,mpDraw, mpPose)
                fallenFlags.append(fallen)
    return imgCopy, fallenFlags

def get_labels(boxes, confs, class_ids, classes):
	indexes = cv2.dnn.NMSBoxes(boxes, confs, confidence_threshold, 0.4)
	labels = []
	for i in range(len(boxes)):
		if i in indexes:
			label = str(classes[class_ids[i]])
			labels.append(label)
	return labels

def get_box_dimensions(outputs, height, width):
	boxes = []
	confs = []
	class_ids = []
	for output in outputs:
		for detect in output:
			scores = detect[5:]
			class_id = np.argmax(scores)
			conf = scores[class_id]
			if conf > confidence_threshold:
				center_x = int(detect[0] * width)
				center_y = int(detect[1] * height)
				w = int(detect[2] * width)
				h = int(detect[3] * height)
				x = int(center_x - w/2)
				y = int(center_y - h / 2)
				if w > min_width * width:
					boxes.append([x, y, w, h])
					confs.append(float(conf))
					class_ids.append(class_id)
	return boxes, confs, class_ids

# API Setup: Initialize the FastAPI app and configure CORS settings
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # Allow requests from any domain
    allow_credentials=True, # Allow credentials (cookies, etc.)
    allow_methods=["*"],    # Allow all HTTP methods
    allow_headers=["*"],    # Allow all headers
)

# YOLO Setup as Global Variables
model, classes, colors, output_layers = load_yolo()
mpPose = mp.solutions.pose
pose = mpPose.Pose()
mpDraw = mp.solutions.drawing_utils
video_capture = ThreadedCamera()
while video_capture.grab_frame() is None:
    time.sleep(0.1)
    


###### ROUTES #######

### GET requests
@app.get("/")
async def hello_world():
    return {"result": "Hello From API", "error": None}

@app.get("/analyze")
async def analyze():
	global response
	return {"result": response, "error": None}

@app.get("/feed")
async def feed():
	global feed
	return {"result": feed, "error": None}

@app.on_event("startup")
async def startup_event():
	t = ThreadedModel()
	t.start()