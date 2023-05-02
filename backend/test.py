import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from flask import jsonify
import pandas as pd
import json

cred = credentials.Certificate("chatbot-7fc2e-firebase-adminsdk-tnee1-f1220bc0b8.json")
firebase_admin.initialize_app(cred)
firebase_db = firestore.client()


#유저 이메일이나 유저 이메일_favorite 인수로 전달받아야 함
#user = data['message']['text']
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("chatbot-7fc2e-firebase-adminsdk-tnee1-f1220bc0b8.json")
firebase_admin.initialize_app(cred)
firebase_db = firestore.client()


user = "hi@naver.com"

users_ref = firebase_db.collection(user)
query = users_ref.order_by("createdAt").limit_to_last(0)
results = query.get()

print(results)
#docs = users_ref.stream()
