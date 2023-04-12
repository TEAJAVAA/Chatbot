from cosine import CosineSimilarity
import pandas as pd
import json
'''
cosineSim=CosineSimilarity()
reply = cosineSim.predict("슬픔", "단맛","20~30", "딸기", "딸기", "딸기", "딸기")


cocktails = []

for i in range(3):
    cocktail_name = reply[i].name

    cocktails.append(cocktail_name)
    print(cocktails)




print(reply)


resultData = pd.read_csv("dataset/cocResult2.csv")
resultData=resultData.drop(['Unnamed: 0'], axis=1)
data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False)
data = data.drop(columns=['신맛내는거', '맛','키워드', 'Unnamed: 10','신맛내는거 포함 문자열'], axis=1)
cocktail=data[data['이름*']=='그루프 스트림']
print(cocktail)

'''
import random

coc_data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False)
coc_data = coc_data.drop(columns=['sour', 'taste','keyword', 'Unnamed: 10','sourstring'], axis=1)
cocktails = []

    
number=random.sample(range(0,len(coc_data)),3)
for i in number:
    cocktail=coc_data.loc[i]
    cocktail['content'] = 'https://github.com/unul09/imageupload/blob/main/content'+str(cocktail['glass'])+'.png?raw=true'
    cocktail['glass'] = 'https://github.com/unul09/imageupload/blob/main/glass'+str(cocktail['glass'])+'.png?raw=true'
    cocktail = cocktail.to_json(force_ascii=False, orient = 'records', indent=4)
    cocktail = json.loads(cocktail)
    print(cocktail)
    cocktails.append(cocktail)
