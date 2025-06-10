import json, time
from flask import Flask, jsonify, request, make_response, send_from_directory
from flask_cors import CORS
import requests
import shutil
import cv2
import collections, numpy
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from keras.models import load_model
from tensorflow.keras.preprocessing import image
import tensorflow_hub as hub
import os
import pickle
from tensorflow.keras.utils import custom_object_scope
import math
import uuid

wagonr_back_model = tf.keras.models.load_model(
    ("models/wagonr_back_model.h5"), custom_objects={"KerasLayer": hub.KerasLayer}
)

wagonr_front_model = tf.keras.models.load_model(
    ("models/wagonr_front_model.h5"), custom_objects={"KerasLayer": hub.KerasLayer}
)

wagonr_inside_model = tf.keras.models.load_model(
    ("models/wagonr_inside_model.h5"), custom_objects={"KerasLayer": hub.KerasLayer}
)

wagonr_outside_model = tf.keras.models.load_model(
    ("models/wagonr_outside_model.h5"), custom_objects={"KerasLayer": hub.KerasLayer}
)

with open("models/eco_model.dat", "rb") as f:
    eco_model = pickle.load(f)

with open("models/price_model.dat", "rb") as f:
    price_model = pickle.load(f)

with open("models/nlp_model.dat", "rb") as f:
    nlp_model = pickle.load(f)
    
with open("models/v_price_model.dat", "rb") as f:
    v_price_model = pickle.load(f)


def all_find(filename, model):
    classes = ["High Condition", "Low Condition", "Medium Condition"]
    img_ = image.load_img(filename, target_size=(224, 224))
    img_array = image.img_to_array(img_)
    img_processed = np.expand_dims(img_array, axis=0)
    img_processed /= 255.0

    model = model
    prediction = model.predict(img_processed)
    prob = prediction

    index = np.argmax(prediction)
    confidence = prob[0][index]

    return str(classes[index]).title(), confidence * 100


UPLOAD_FOLDER = "temp/"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app = Flask(__name__)


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response

@app.route('/valuation', methods=['POST'])
def valuation():
    
    try:
        request_data = request.get_json()

        image_url1 = str("temp/"+request_data['url1'])
        image_url2 = str("temp/"+request_data['url2'])
        image_url3 = str("temp/"+request_data['url3'])
        image_url4 = str("temp/"+request_data['url4'])

        res1,accuracy1 =all_find(image_url1,wagonr_front_model)
        res2,accuracy2 =all_find(image_url2,wagonr_back_model)
        res3,accuracy3 =all_find(image_url3,wagonr_inside_model)
        res4,accuracy4 =all_find(image_url4,wagonr_outside_model)

        if round(accuracy1,2)<50:
            res1="No Detected"
            accuracy1=0
        
        if round(accuracy2,2)<50:
            res2="No Detected"
            accuracy2=0
        
        if round(accuracy3,2)<50:
            res3="No Detected"
            accuracy3=0
        
        if round(accuracy4,2)<50:
            res4="No Detected"
            accuracy4=0

        json_dump = json.dumps({"res1":str(res1),"accuracy1":str(round(accuracy1,2)),"res2":str(res2),"accuracy2":str(round(accuracy2,2)),"res3":str(res3),"accuracy3":str(round(accuracy3,2)),"res4":str(res4),"accuracy4":str(round(accuracy4,2)),"success":"true"})

        return json_dump
        
    except:
        print("An exception occurred")
        json_dump = json.dumps({"success":"false"})

        return json_dump

@app.route("/nlp_model", methods=["POST"])
def nlp():

    try:
        request_data = request.get_json()

        text = str(request_data["text"])
        print(text)
        print(request_data)

        results = nlp_model.predict([text])

        json_dump = json.dumps({"res": str(results[0]), "success": "true"})

        return json_dump

    except:
        json_dump = json.dumps({"success": "false"})

        return json_dump

@app.route("/eco", methods=["POST"])
def eco():

    request_data = request.get_json()

    make = str(request_data["make"])
    v_model = str(request_data["model"])
    vehicle_class = str(request_data["vehicle_class"])
    transmission = str(request_data["transmission"])
    fuel_type = str(request_data["fuel_type"])
    engine_size = str(request_data["engine_size"])
    cylinders = str(request_data["cylinders"])
    fuel_consumption_city = str(request_data["fuel_consumption_city"])
    fuel_consumption_hwy = str(request_data["fuel_consumption_hwy"])
    fuel_consumption_comb = str(request_data["fuel_consumption_comb"])

    input_data = np.array([[make, v_model, vehicle_class, transmission, fuel_type, engine_size, cylinders, fuel_consumption_city, fuel_consumption_hwy, fuel_consumption_comb]])
    
    prediction = eco_model.predict(input_data)

    json_dump = json.dumps({"co2": str(prediction[0][1]), "fuel": str(prediction[0][0]),"success": "true"})

    return json_dump


@app.route("/price", methods=["POST"])
def price():

    request_data = request.get_json()

    model = str(request_data["model"])
    brand = str(request_data["brand"])
    yom = str(request_data["yom"])
    transmission = str(request_data["transmission"])
    fuel_type = str(request_data["fuel_type"])
    mileage = str(request_data["mileage"])
    color = str(request_data["color"])
    engine = str(request_data["engine"])
    body_type = str(request_data["body_type"])
    month = str(request_data["month"])
    location = str(request_data["location"])
    
    prediction = math.ceil(price_model.predict([[brand,model,yom,transmission,mileage,fuel_type,color,engine,body_type,month,location]]))

    json_dump = json.dumps({"price": str(prediction),"success": "true"})

    return json_dump

@app.route("/v_price", methods=["POST"])
def v_price():

    request_data = request.get_json()

    name = str(request_data["name"])
    year = str(request_data["year"])
    km_driven = str(request_data["km_driven"])
    fuel = str(request_data["fuel"])
    seller_type = str(request_data["seller_type"])
    transmission = str(request_data["transmission"])
    owner = str(request_data["owner"])
    
    prediction = math.ceil(v_price_model.predict([[name,year,km_driven,fuel,seller_type,transmission,owner]]))

    json_dump = json.dumps({"price": str(prediction),"success": "true"})

    return json_dump

@app.route("/images/<filename>")
def get_image(filename):
    return send_from_directory("temp", filename)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1111)
