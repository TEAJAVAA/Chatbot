from flask import Flask, jsonify, request
from model import TransModel, FeelModel, AlcholModel, TasteModel
from cosine import CosineSimilarity
import pandas as pd
import json

cosineSim=CosineSimilarity()

feelModel=FeelModel()
transModel=TransModel()
alcholModel = AlcholModel()
tasteModel = TasteModel()

app = Flask(__name__)


@app.route('/hello')
def hello():
    return {'result': "Hello World"}


@app.route('/recommend_cocktail', methods=['POST'])
def recommend_cocktail():
    reply = cosineSim.predict(feel_input,taste_input, degree_input,ingredient_input, free_talk1, free_talk2, etc_input)
    print(reply, type(reply))
    cocktail_name = reply.name
    
    reply = reply.to_json(force_ascii=False, orient = 'records', indent=4)
    reply = json.loads(reply)
    reply.insert(0, cocktail_name)

    return jsonify(result="success", reply=reply)

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
        reply = ["알겠습니다! "]
        return jsonify(result="success", reply=reply)

    elif info == "rate":
        global degree_input
        degree_input = predict_alchol()
        reply = ["알겠습니다! "]
        return jsonify(result="success", reply=reply)

    elif info == "ingredient":
        global ingredient_input
        ingredient_input = data['message']['text']
        reply = ["알겠습니다! "]
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