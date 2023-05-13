from cosine import CosineSimilarity
import pandas as pd
import json
'''

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from model import ChatGPT_api

cred = credentials.Certificate("chatbot-7fc2e-firebase-adminsdk-tnee1-f1220bc0b8.json")
firebase_admin.initialize_app(cred)
firebase_db = firestore.client()
chatGPT_api=ChatGPT_api()
users_ref = firebase_db.collection("test@naver.com_freechat")
docs = users_ref.order_by("createdAt").limit_to_last(4).get()
text1 = docs[0].to_dict()['text']
text2 = docs[1].to_dict()['text']
text3 = docs[2].to_dict()['text']

reply = []
reply = str(chatGPT_api.reply_free(text1, text2, text3))
print(reply)
'''

'''cosineSim=CosineSimilarity()
reply = cosineSim.predict("슬픔", "단맛","20~30", "딸기", "딸기", "딸기", "딸기")


cocktails = []

for i in range(3):
    cocktail_name = reply[i].name

    cocktails.append(cocktail_name)
    print(cocktails)'''

'''resultData = pd.read_csv("dataset/cocResult2.csv", index_col=0)
data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False)
data = data.drop(columns=['sour', 'taste','keyword', 'Unnamed: 10','sourstring'], axis=1)
dummy = data
Cluster1_list = list(resultData[resultData.cluster == 0].data_index)
cluster1 = dummy.loc[dummy["name"].isin(Cluster1_list)]
Cluster2_list = list(resultData[resultData.cluster == 1].data_index)
cluster2 = dummy.loc[dummy["name"].isin(Cluster2_list)]
Cluster3_list = list(resultData[resultData.cluster == 2].data_index)
cluster3 = dummy.loc[dummy["name"].isin(Cluster3_list)]
Cluster4_list = list(resultData[resultData.cluster == 3].data_index)
cluster4 = dummy.loc[dummy["name"].isin(Cluster4_list)]
Cluster5_list = list(resultData[resultData.cluster == 4].data_index)
cluster5 = dummy.loc[dummy["name"].isin(Cluster5_list)]
Cluster6_list = list(resultData[resultData.cluster == 5].data_index)
cluster6 = dummy.loc[dummy["name"].isin(Cluster6_list)]
Cluster7_list = list(resultData[resultData.cluster == 6].data_index)
cluster7 = dummy.loc[dummy["name"].isin(Cluster7_list)]
Cluster8_list = list(resultData[resultData.cluster == 7].data_index)
cluster8 = dummy.loc[dummy["name"].isin(Cluster8_list)]
Cluster9_list = list(resultData[resultData.cluster == 8].data_index)
cluster9 = dummy.loc[dummy["name"].isin(Cluster9_list)]
Cluster10_list = list(resultData[resultData.cluster == 9].data_index)
cluster10 = dummy.loc[dummy["name"].isin(Cluster10_list)]

result_cluster = pd.concat([cluster1,cluster9,cluster10])

recipe_list=list(result_cluster['recipe'])
print(recipe_list[0])
explanation=list(result_cluster['info'])
print(type(explanation[0]))
from konlpy.tag import Okt
okt = Okt()

explanation.append("레몬이 먹고싶어")

for i in range(len(explanation)):
    explanation[i] = okt.nouns(explanation[i])
    explanation[i] = ', '.join(s for s in explanation[i])
    if(explanation[i] is None):
        print(i)
    
'''


'''
resultData = pd.read_csv("dataset/cocResult2.csv")
resultData=resultData.drop(['Unnamed: 0'], axis=1)
data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False)
data = data.drop(columns=['신맛내는거', '맛','키워드', 'Unnamed: 10','신맛내는거 포함 문자열'], axis=1)
cocktail=data[data['이름*']=='그루프 스트림']
print(cocktail)
'''




'''
coc_data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False)
coc_data = coc_data.drop(columns=['sour', 'taste','keyword', 'Unnamed: 10','sourstring'], axis=1)
cocktails = []

cocktail=coc_data[coc_data['name']=='어스퀘이크(진)']
cocktail = cocktail.to_json(force_ascii=False, orient = 'records', indent=4)
print(cocktail)
coc_data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False)
coc_data = coc_data.drop(columns=['sour', 'taste','keyword', 'Unnamed: 10','sourstring'], axis=1)

cocktail=coc_data.loc[[0],:]
cocktail = cocktail.to_json(force_ascii=False, orient = 'records', indent=4)
print(cocktail)

'''
from cosine import CosineSimilarity
cosineSim=CosineSimilarity()
result=cosineSim.predictItem('어스퀘이크(진)')
print(result[0]['name'])
reply = cosineSim.predict("슬픔", "단맛","20~30", "딸기", "딸기", "딸기", "딸기")
print(reply)

'''
number=random.sample(range(0,len(coc_data)),3)
for i in number:
    cocktail=coc_data.loc[i]
    cocktail = cocktail.to_json(force_ascii=False, orient = 'records', indent=4)
    cocktail = json.loads(cocktail)
    cocktail['content'] = 'https://github.com/unul09/imageupload/blob/main/content'+str(cocktail['glass'])+'.png?raw=true'
    cocktail['glass'] = 'https://github.com/unul09/imageupload/blob/main/glass'+str(cocktail['glass'])+'.png?raw=true'
    print(cocktail)
    cocktails.append(cocktail)
'''

'''
import openai
openai.api_key="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"

messages=[]
messages.append({"role": "assistant", "content":"연애는 잘 되어가고 있으신가요?"})
content=input("연애는 잘 되어가고 있으신가요? ")
messages.append({"role": "user", "content":content})
messages.append({"role": "system", "content":" 에 대한 답변을 한문장으로 해줘"})
completion=openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=messages
)
chat_response=completion.choices[0].message.content
print(chat_response)
messages.append({"role": "assistant", "content":chat_response})
'''

