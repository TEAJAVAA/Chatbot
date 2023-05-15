import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'

import tensorflow as tf
from keras_preprocessing.sequence import pad_sequences
import tensorflow as tf
from keras.preprocessing.text import Tokenizer
import csv
from keras.models import load_model

import openai
openai.api_key="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"

class ChatGPT_api():
    def __init__(self):
        self.initialize()

    def initialize(self, ):
        self.messages = []

    def reply(self, chat_question, user_response):
        #self.messages = []
        print("self.messages content(before): ",self.messages)
        prompt_additions = " / 답변은 한문장으로 긍정적이거나 유머러스하게 존댓말로 해줘"
        self.messages.append({"role": "assistant", "content": chat_question})
        self.messages.append({"role": "user", "content": user_response})
        self.messages.append({"role": "system", "content": prompt_additions})
        completion=openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=self.messages
        )
        chat_response=completion.choices[0].message.content
        self.messages.append({"role": "assistant", "content":chat_response})
        print("self.messages content(after): ",self.messages)
        return chat_response
    
    def reply_free(self, text1_user, text2_chatbot, text3_user):
        self.messages = []
        prompt_additions = " / 답변은 한문장으로 긍정적이거나 유머러스하게 존댓말로 해줘"
        self.messages.append({"role": "user", "content": text3_user})
        self.messages.append({"role": "assistant", "content": text2_chatbot})
        self.messages.append({"role": "user", "content": text1_user})
        self.messages.append({"role": "system", "content": prompt_additions})
        completion=openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=self.messages
        )
        chat_response=completion.choices[0].message.content
        self.messages.append({"role": "assistant", "content":chat_response})
        return chat_response
        



class FeelModel():
    def __init__(self):
        self.initialize()

    def initialize(self, ):
        self.model = tf.keras.models.load_model('model/feel_model.h5')
        self.tokenizer = Tokenizer(25000)
        X_train = []
        with open('dataset/X_train_feel.csv', 'r', newline='', encoding='UTF-8') as file:
            myreader = csv.reader(file, delimiter=',')
            for rows in myreader:
                X_train.append(rows)
        self.tokenizer.fit_on_texts(X_train)
        self.emotion_list = ['분노', '기쁨', '불안', '당황', '슬픔', '상처']

    def predict(self,sentence):
        if sentence is None:
            return '분노'
        token_stc = sentence.split()
        encode_stc = self.tokenizer.texts_to_sequences([token_stc])
        pad_stc = pad_sequences(encode_stc, maxlen=15)

        score = self.model.predict(pad_stc)
        print(self.emotion_list[score.argmax()], score[0, score.argmax()])
        return self.emotion_list[score.argmax()]


class AlcholModel():
    def __init__(self):
        self.initialize()

    def initialize(self, ):
        from keras.models import load_model
        self.model = load_model('model/alchol_model.h5')
        self.label_list = [1.0, 3.0, 2.0, 0.0]
        X_train = []
        with open('dataset/X_train_alchol.csv', 'r', newline='', encoding='UTF-8') as file:
            myreader = csv.reader(file, delimiter=',')
            for rows in myreader:
                X_train.append(rows)
        self.tokenizer = Tokenizer(25000)
        self.tokenizer.fit_on_texts(X_train)
        
    def predict(self, sentence):
        if sentence is None:
            return '10~20'
        token_stc = sentence.split()
        encode_stc = self.tokenizer.texts_to_sequences([token_stc])
        pad_stc = pad_sequences(encode_stc, maxlen=5)
        score = self.model.predict(pad_stc)
        category=self.label_list[score.argmax()]
        cat_list=['무알콜', '0~10', '10~20', '20~30']
        # print(cat_list[int(category)], score[0, score.argmax()])
        return cat_list[int(category)]


class TasteModel():
    def __init__(self):
        self.initialize()

    def initialize(self, ):
        self.model = loaded_model = load_model('model/taste_model.h5')
        self.tokenizer = Tokenizer(25000)
        X_train = []
        with open('dataset/X_train_taste.csv', 'r', newline='', encoding='UTF-8') as file:
            myreader = csv.reader(file, delimiter=',')
            for rows in myreader:
                X_train.append(rows)
        self.tokenizer.fit_on_texts(X_train)
        self.label_list=['단맛', '신맛', '쓴맛']

    def predict(self,sentence):
        if sentence is None:
            return '단맛'
        token_stc = sentence.split()
        encode_stc = self.tokenizer.texts_to_sequences([token_stc])
        pad_stc = pad_sequences(encode_stc, maxlen=8)

        score = self.model.predict(pad_stc)
        category=self.label_list[score.argmax()]
        print(category, score[0, score.argmax()])
        return category