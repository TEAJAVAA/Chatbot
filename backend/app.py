from flask import Flask, jsonify, request
from model import TransModel, FeelModel, AlcholModel

feelModel=FeelModel()
transModel=TransModel()
alcholModel = AlcholModel()

app = Flask(__name__)

@app.route('/hello')
def say_hello_world():
    return {'result': "Hello World"}

@app.route('/message', methods=['POST'])
def message():
   data = request.get_json(force=True)
   message = data['message']['text']
   print(message)
   print(data)
   #추가
   reply = []
   reply = str(transModel.predict(message))+str(feelModel.predict(message))+str(alcholModel.predict(message))
   return jsonify(result="success", reply=reply)

@app.route('/predict_alchol', methods=['POST'])
def predict_alchol():
    data = request.get_json(force=True)
    message = data['message']['text']
    reply = []
    reply = alcholModel.get_answer(message)
    return jsonify(result="success", reply=reply)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5001', debug=True)