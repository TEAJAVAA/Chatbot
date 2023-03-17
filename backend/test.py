from cosine import CosineSimilarity
import pandas as pd
import json

cosineSim=CosineSimilarity()
reply = cosineSim.predict("기쁨", "쓴맛","0~10", "ㄹ", "d", "w", "ㅐ")

cocktails = []

for i in range(3):
    cocktail_name = reply[i].name
    
    cocktail = reply[i].to_json(force_ascii=False, orient = 'records', indent=4)
    cocktail = json.loads(cocktail)
    cocktail.insert(0, cocktail_name)

    cocktails.append(cocktail)


print(cocktails)
