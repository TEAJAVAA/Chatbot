from cosine import CosineSimilarity
import pandas as pd
import json

cosineSim=CosineSimilarity()
reply = cosineSim.predict("기쁨", "쓴맛","0~10", "ㄹ", "d", "w", "ㅐ")



for i in range(3):
    cocktail_name = reply[i].name
    
    reply[i] = reply[i].to_json(force_ascii=False, orient = 'records', indent=4)
    reply[i] = json.loads(reply[i])
    reply[i].insert(0, cocktail_name)


print(reply)