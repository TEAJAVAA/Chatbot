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
from model import ChatGPT_api

api=ChatGPT_api()

api.reply("학교나 직장 생활은 어떠신가요?", "모르겠어 너무 어렵고 힘들어")
