from flask import Flask, jsonify, request

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
   return message


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5001', debug=True)