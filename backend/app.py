from flask import Flask, jsonify, request
from model import TransModel

transModel=TransModel()

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
   reply = transModel.predict(message)
   return jsonify(result="success", reply=reply)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5001', debug=True)