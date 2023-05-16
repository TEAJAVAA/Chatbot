from flask import Flask, jsonify, request
from model import FeelModel, AlcholModel, TasteModel
from cosine import CosineSimilarity
import pandas as pd
import json
import random
import model

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("chatbot-7fc2e-firebase-adminsdk-tnee1-f1220bc0b8.json")
firebase_admin.initialize_app(cred)
firebase_db = firestore.client()

cosineSim=CosineSimilarity()
feelModel=FeelModel()

alcholModel = AlcholModel()
tasteModel = TasteModel()

BOT_replies = ['알겠습니다!', '알겠습니다.', '확인했어요!', '확인했습니다.', '잘 알겠습니다.', '좋은 선택이에요.', '멋진 선택이에요!', '추천에 참고할게요.', '안목이 탁월하시네요.', '저랑 통하셨네요.', '느낌이 좋네요.']

app = Flask(__name__) 

coc_data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False)
coc_data = coc_data.drop(columns=['sour', 'taste','keyword', 'Unnamed: 10','sourstring', 'topping'], axis=1)
coc_data['content'] = coc_data['glass'].apply(lambda x: 'https://github.com/unul09/imageupload/blob/main/content'+str(x)+'.png?raw=true')
coc_data['glass'] = coc_data['glass'].apply(lambda x: 'https://github.com/unul09/imageupload/blob/main/glass'+str(x)+'.png?raw=true')
       

class currentUser():
    def __init__(self, name):
        print("new user created!")
        self.name = name
        self.chatGPT_api = model.ChatGPT_api()
        self.name = name
        self.feel_input = ''
        self.free_talk1 = ''
        self.free_talk2 = ''
        self.taste_input = ''
        self.degree_input = ''
        self.ingredient_input = ''
        self.etc_input = ''
    def chat_pred(self, question, message):
        return self.chatGPT_api.reply(question, message)
    def chat_free_pred(self, message):
        return self.chatGPT_api.reply_free(message)

users = {}

@app.route('/logout', methods=['POST'])
def logout():
    data = request.get_json(force=True)
    user = data['user']
    if user in users:
        del users[user]


@app.route('/getLatestText', methods=['POST'])
def getLatestText(user):
    users_ref = firebase_db.collection(user)
    docs = users_ref.order_by("createdAt").limit_to_last(1).get()
    text = docs[0].to_dict()['text']
    return text

@app.route('/favorite', methods=['POST'])
def favorite():
    data = request.get_json(force=True)
    #유저 이메일이나 유저 이메일_favorite 인수로 전달받아야 함
    user = data['user_favorite']
    #user = 'test@naver.com_favorite'
    users_ref = firebase_db.collection(user)
    docs = users_ref.stream()
    coc_data_fav = coc_data.loc[:,['name','glass','color','content']]
    cocktails = []
    for doc in docs:
        cocktail=coc_data_fav[coc_data_fav['name']==doc.id]
        cocktail = cocktail.to_json(force_ascii=False, orient = 'records', indent=4)
        cocktail = json.loads(cocktail)[0]
        cocktail['title'] = cocktail.pop('name')
        cocktails.append(cocktail)
    return jsonify(result="success", cocktails=cocktails)

@app.route('/item', methods=['POST'])
def item():
    data = request.get_json(force=True)
    user = data['user_favorite']
    users_ref = firebase_db.collection(user)
    docs = users_ref.stream() 
    cocktails = []
    docs_num=len(list(docs))
    
    if docs_num==0:
        number=random.sample(range(0,len(coc_data)),3)
        for i in number:
            cocktail=coc_data.loc[[i],:]
            cocktail = cocktail.to_json(force_ascii=False, orient = 'records', indent=4)
            cocktail = json.loads(cocktail)[0]
            cocktail['title'] = cocktail.pop('name')
            cocktails.append(cocktail)

    else: 
        docs = users_ref.stream()
        number=random.randrange(0,docs_num)
        count=0
        for doc in docs:
            if count==number:
                target_cocktail=coc_data.loc[coc_data['name']==doc.id]
                target_cocktail = target_cocktail.to_json(force_ascii=False, orient = 'records', indent=4)
                target_cocktail = json.loads(target_cocktail)[0]
                result=cosineSim.predictItem(doc.id)
                for i in range(3):
                    cocktail_name=result[i]['name']
                    cocktail=coc_data[coc_data['name']==cocktail_name]
                    cocktail = cocktail.to_json(force_ascii=False, orient = 'records', indent=4)
                    cocktail = json.loads(cocktail)[0]
                    cocktail['title'] = cocktail.pop('name')
                    cocktails.append(cocktail)
            count+=1
            
    return jsonify(result="success",  cocktails=cocktails)

@app.route('/search',methods=['GET', 'POST'])
def search():
    if request.method=='POST':
        data = request.get_json(force=True)
        message = data['key']
        coc_result = coc_data[coc_data['name'].str.contains(message) | coc_data['recipe'].str.contains(message)]
        coc_result = coc_result.to_json(force_ascii=False, orient = 'records', indent=4)
        coc_result = json.loads(coc_result)
        return jsonify(result="success", cocktail=coc_result)
    else:
        coc_result_all = coc_data.to_json(force_ascii=False, orient = 'records', indent=4)
        coc_result_all = json.loads(coc_result_all)
        return jsonify(result="success", cocktail=coc_result_all)

@app.route('/detail',methods=['POST'])
def detail():
    data = request.get_json(force=True)
    message = data['name']
    cocktail=coc_data[coc_data['name']==message]
    cocktail = cocktail.to_json(force_ascii=False, orient = 'records', indent=4)
    cocktail = json.loads(cocktail)
    return jsonify(result="success", cocktail=cocktail)

@app.route('/recommend_cocktail', methods=['POST'])
def recommend_cocktail(user):
    reply = cosineSim.predict(users[user].feel_input, users[user].taste_input, users[user].degree_input, users[user].ingredient_input, users[user].free_talk1, users[user].free_talk2, users[user].etc_input)
    cocktails = []
    for i in range(3):
        cocktail = reply[i].to_json(force_ascii=False, orient = 'records', indent=4)
        cocktail = json.loads(cocktail)
        cocktails.append(cocktail)
    reply = "당신을 위한 칵테일을 추천드립니다!"
    del users[user]
    return jsonify(result="success", reply=reply, cocktail1=cocktails[0], cocktail2=cocktails[1],cocktail3=cocktails[2])

@app.route('/freeMessage', methods=['POST'])
def free_message():
    data = request.get_json(force=True)
    message = data['message']['text']
    user = data['user']
    if not (user in users):
        users[user] = currentUser(user)
    reply = []
    reply = users[user].chat_free_pred(message)
    return jsonify(result="success", reply=reply)
    
@app.route('/message', methods=['POST'])
def message():
    data = request.get_json(force=True)
    message = data['message']['text']
    user = data['user']

    if not (user in users):
        users[user] = currentUser(user)
   
    info = data['information']
    if info == "feel":
        users[user].feel_input = predict_feel(message)
        question = "오늘 기분이 어떠신가요?"
        reply = []
        reply = users[user].chat_pred(question, message)
        return jsonify(result="success", reply=reply)

    elif info == "free1":
        users[user].free_talk1 = message
        reply = []
        question = getLatestText(user)
        reply = users[user].chat_pred(question, message)
        return jsonify(result="success", reply=reply)

    elif info == "free2":
        users[user].free_talk2 = message
        reply = []
        question = getLatestText(user)
        reply = users[user].chat_pred(question, message)
        return jsonify(result="success", reply=reply)

    elif info == "taste":
        users[user].taste_input = predict_taste(message)
        reply = random.choice(BOT_replies)
        return jsonify(result="success", reply=reply)

    elif info == "rate":
        users[user].degree_input = predict_alchol(message)
        reply = random.choice(BOT_replies)
        return jsonify(result="success", reply=reply)

    elif info == "ingredient":
        users[user].ingredient_input = message
        reply = random.choice(BOT_replies)
        return jsonify(result="success", reply=reply)

    elif info == "extra":
        users[user].etc_input = message
        return recommend_cocktail(user)

    else:
        return jsonify(result="error")

    

# 도수 예측치 json으로 반환
@app.route('/predict_alchol', methods=['POST'])
def predict_alchol(message):
    reply = []
    reply = alcholModel.predict(message)
    return reply

# 감정 예측치 json으로 반환
@app.route('/predict_feel', methods=['POST'])
def predict_feel(message):
    reply = []
    reply = feelModel.predict(message)
    return reply

# 맛 예측치 json으로 반환
@app.route('/predict_taste', methods=['POST'])
def predict_taste(message):
    reply = []
    reply = tasteModel.predict(message)
    return reply

if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5001', debug=True)