import tensorflow as tf
import re
import pandas as pd
import tensorflow_datasets as tfds
import numpy as np


class TransModel():
    def __init__(self):
        self.initialize()

    def initialize(self, ):
        model = tf.keras.models.load_model('/Users/apple/Desktop/BackEnd/Chatbot/backend/my_model',compile=False,custom_objects={"create_padding_mask": self.create_padding_mask})
        self.model = model

        data = pd.read_csv('/Users/apple/Desktop/BackEnd/Chatbot/backend/dataset/ChatbotData (1).csv')
        bar_data=pd.read_csv('/Users/apple/Desktop/BackEnd/Chatbot/backend/dataset/자유대화 (1).csv')
        train_data = pd.concat([data, bar_data],ignore_index=True)
        train_data = train_data.sample(frac=1).reset_index(drop=True)
        questions = []
        for sentence in train_data['Q']:
            sentence = re.sub(r"([?.!,])", r" \1 ", sentence)
            sentence = sentence.strip()
            questions.append(sentence)
        answers = []
        for sentence in train_data['A']:
            sentence = re.sub(r"([?.!,])", r" \1 ", sentence)
            sentence = sentence.strip()
            answers.append(sentence)
        self.tokenizer = tfds.deprecated.text.SubwordTextEncoder.build_from_corpus(
            questions + answers, target_vocab_size=2**13)
    
        self.START_TOKEN = [self.tokenizer.vocab_size]
        self.END_TOKEN = [self.tokenizer.vocab_size + 1]
        self.VOCAB_SIZE = self.tokenizer.vocab_size + 2    
        self.MAX_LENGTH = 40

    def create_padding_mask(self, x):
        mask = tf.cast(tf.math.equal(x, 0), tf.float32)
        # (batch_size, 1, 1, key의 문장 길이)
        return mask[:, tf.newaxis, tf.newaxis, :]
		
    def preprocess_sentence(self, sentence):
        sentence = re.sub(r"([?.!,])", r" \1 ", sentence)
        sentence = sentence.strip()
        return sentence

    def evaluate(self, sentence):
        sentence = self.preprocess_sentence(sentence)
        sentence = tf.expand_dims(
        self.START_TOKEN + self.tokenizer.encode(sentence) + self.END_TOKEN, axis=0)

        output = tf.expand_dims(self.START_TOKEN, 0)

        # 디코더의 예측 시작
        for i in range(self.MAX_LENGTH):
            predictions = self.model(inputs=[sentence, output], training=False)

            # 현재(마지막) 시점의 예측 단어를 받아온다.
            predictions = predictions[:, -1:, :]
            predicted_id = tf.cast(tf.argmax(predictions, axis=-1), tf.int32)

            # 만약 마지막 시점의 예측 단어가 종료 토큰이라면 예측을 중단
            if tf.equal(predicted_id, self.END_TOKEN[0]):
                break

            # 마지막 시점의 예측 단어를 출력에 연결한다.
            # 이는 for문을 통해서 디코더의 입력으로 사용될 예정이다.
            output = tf.concat([output, predicted_id], axis=-1)

        return tf.squeeze(output, axis=0)

    def predict(self, sentence):
        prediction = self.evaluate(sentence)

        predicted_sentence = self.tokenizer.decode(
            [i for i in prediction if i < self.tokenizer.vocab_size])
    
        print(predicted_sentence)
        return predicted_sentence



