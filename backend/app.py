from flask import Flask, jsonify, request
from model import TransModel, FeelModel, AlcholModel, TasteModel
from cosine import CosineSimilarity
import pandas as pd
import json
import random

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("chatbot-7fc2e-firebase-adminsdk-tnee1-f1220bc0b8.json")
firebase_admin.initialize_app(cred)
firebase_db = firestore.client()

cosineSim=CosineSimilarity()
feelModel=FeelModel()
transModel=TransModel()
alcholModel = AlcholModel()
tasteModel = TasteModel()

BOT_replies = ['알겠습니다!', '알겠습니다.', '확인했어요!', '확인했습니다.', '잘 알겠습니다.', '좋은 선택이에요.', '멋진 선택이에요!', '추천에 참고할게요.', '안목이 탁월하시네요.', '저랑 통하셨네요.', '느낌이 좋네요.']

app = Flask(__name__) 


@app.route('/favorite', methods=['POST'])
def favorite():
    data = request.get_json(force=True)

    #유저 이메일이나 유저 이메일_favorite 인수로 전달받아야 함
    user = data['user_favorite']
    #user = 'test@naver.com_favorite'
    users_ref = firebase_db.collection(user)
    docs = users_ref.stream()

    coc_data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False)
    # coc_data = coc_data.drop(columns=['sour', 'taste','keyword', 'Unnamed: 10','sourstring'], axis=1)
    coc_data = coc_data.loc[:,['name','glass','color']]

    cocktails = []
    for doc in docs:
        print(doc.id)
        cocktail=coc_data[coc_data['name']==doc.id]
        cocktail = cocktail.to_json(force_ascii=False, orient = 'records', indent=4)
        cocktail = json.loads(cocktail)
        cocktail['content'] = 'https://github.com/unul09/imageupload/blob/main/content'+str(cocktail['glass'])+'.png?raw=true'
        cocktail['glass'] = 'https://github.com/unul09/imageupload/blob/main/glass'+str(cocktail['glass'])+'.png?raw=true'
        cocktail['title'] = cocktail.pop('name')
        cocktails.append(cocktail)

    print(cocktails)
    return jsonify(result="success", cocktails=cocktails)

@app.route('/item', methods=['POST'])
def item():
    data = request.get_json(force=True)
    user = data['user_favorite']
    users_ref = firebase_db.collection(user)
    docs = users_ref.stream()

    coc_data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False)
    coc_data = coc_data.drop(columns=['sour', 'taste','keyword', 'Unnamed: 10','sourstring'], axis=1)
    cocktails = []

    docs_num=len(list(docs))

    if docs_num==0:
        number=random.sample(range(0,len(coc_data)),3)
        for i in number:
            cocktail=coc_data.loc[[i],:]
            cocktail = cocktail.to_json(force_ascii=False, orient = 'records', indent=4)
            cocktail = json.loads(cocktail)[0]
            cocktail['content'] = 'https://github.com/unul09/imageupload/blob/main/content'+str(cocktail['glass'])+'.png?raw=true'
            cocktail['glass'] = 'https://github.com/unul09/imageupload/blob/main/glass'+str(cocktail['glass'])+'.png?raw=true'
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
                degree=target_cocktail.pop('degree')
                recipe=target_cocktail.pop('recipe')
                info=target_cocktail.pop('info')
                result=cosineSim.predictItem(doc.id,degree, recipe, info)
                for i in range(3):
                    cocktail_name=result[i]['name']
                    cocktail=coc_data[coc_data['name']==cocktail_name]
                    cocktail = cocktail.to_json(force_ascii=False, orient = 'records', indent=4)
                    cocktail = json.loads(cocktail)[0]
                    cocktail['content'] = 'https://github.com/unul09/imageupload/blob/main/content'+str(cocktail['glass'])+'.png?raw=true'
                    cocktail['glass'] = 'https://github.com/unul09/imageupload/blob/main/glass'+str(cocktail['glass'])+'.png?raw=true'
                    cocktail['title'] = cocktail.pop('name')
                    cocktails.append(cocktail)
            count+=1
            
    return jsonify(result="success",  cocktails=cocktails)



@app.route('/search',methods=['GET', 'POST'])
def search():
    coc_data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False)
    coc_data = coc_data.drop(columns=['sour', 'taste','keyword', 'Unnamed: 10','sourstring'], axis=1)
    if request.method=='POST':
        data = request.get_json(force=True)
        message = data['message']['text']
        coc_result = coc_data[coc_data['name'].str.contains(message) | coc_data['recipe'].str.contains(message)]
        print(coc_result)
        coc_result = coc_result.to_dict()
        return jsonify(result="success", cocktail=coc_result)
    else:
        coc_result_all = coc_data.to_dict()
        print("칵테일 정보 모두 전송 ...")
        return jsonify(result="success", cocktail=coc_result_all)

@app.route('/detail',methods=['POST'])
def detail():
    data = request.get_json(force=True)
    # print(data)
    message = data['name']
    # print(message)
    # print(len(message))
    
    coc_data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False)
    coc_data = coc_data.drop(columns=['sour', 'taste','keyword', 'Unnamed: 10','sourstring'], axis=1)
    cocktail=coc_data[coc_data['name']==message]
    # print(cocktail)

    cocktail = cocktail.to_json(force_ascii=False, orient = 'records', indent=4)
    cocktail = json.loads(cocktail)
    # print(cocktail)
    return jsonify(result="success", cocktail=cocktail)

@app.route('/hello')
def hello():
    return {'result': "Hello World"}


@app.route('/recommend_cocktail', methods=['POST'])
def recommend_cocktail():
    reply = cosineSim.predict(feel_input,taste_input, degree_input,ingredient_input, free_talk1, free_talk2, etc_input)
    cocktails = []

    for i in range(3):
        
        cocktail = reply[i].to_json(force_ascii=False, orient = 'records', indent=4)
        cocktail = json.loads(cocktail)
        cocktails.append(cocktail)

    reply = "당신을 위한 칵테일을 추천드립니다!"
    print(cocktails[0])

    return jsonify(result="success", reply=reply, cocktail1=cocktails[0], cocktail2=cocktails[1],cocktail3=cocktails[2])
    

@app.route('/viewAll', methods=['POST'])
def viewAll():
   data = str(feel_input) + str('\n') + str(free_talk1) + str('\n') + str(free_talk2) + str('\n') + str(taste_input) + str('\n') + str(degree_input) + str('\n') + str(ingredient_input) + str('\n') + str(etc_input)
   return jsonify(result="success", reply=data)

@app.route('/message', methods=['POST'])
def message():
    data = request.get_json(force=True)
    message = data['message']['text']
   
    info = data['information']
    if info == "feel":
        global feel_input
        feel_input = predict_feel()
        reply = []
        reply = str(transModel.predict(message))
        return jsonify(result="success", reply=reply)

    elif info == "free1":
        global free_talk1
        free_talk1 = data['message']['text']
        reply = []
        reply = str(transModel.predict(message))
        return jsonify(result="success", reply=reply)

    elif info == "free2":
        global free_talk2
        free_talk2 = data['message']['text']
        reply = []
        reply = str(transModel.predict(message))
        return jsonify(result="success", reply=reply)

    elif info == "taste":
        global taste_input
        taste_input = predict_taste()
        reply = random.choice(BOT_replies)
        return jsonify(result="success", reply=reply)

    elif info == "rate":
        global degree_input
        degree_input = predict_alchol()
        reply = random.choice(BOT_replies)
        return jsonify(result="success", reply=reply)

    elif info == "ingredient":
        global ingredient_input
        ingredient_input = data['message']['text']
        reply = random.choice(BOT_replies)
        return jsonify(result="success", reply=reply)

    elif info == "extra":
        global etc_input
        etc_input = data['message']['text']
        return recommend_cocktail()

    else:
        return jsonify(result="error")

    #추가
    

# 도수 예측치 json으로 반환
@app.route('/predict_alchol', methods=['POST'])
def predict_alchol():
    data = request.get_json(force=True)
    message = data['message']['text']
    reply = []
    reply = alcholModel.predict(message)
    return reply

# 감정 예측치 json으로 반환
@app.route('/predict_feel', methods=['POST'])
def predict_feel():
    data = request.get_json(force=True)
    message = data['message']['text']
    reply = []
    reply = feelModel.predict(message)
    return reply

# 맛 예측치 json으로 반환
@app.route('/predict_taste', methods=['POST'])
def predict_taste():
    data = request.get_json(force=True)
    message = data['message']['text']
    reply = []
    reply = tasteModel.predict(message)
    return reply

if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5001', debug=True)