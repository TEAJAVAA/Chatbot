from cosine import CosineSimilarity
import pandas as pd
import json

cosineSim=CosineSimilarity()
reply = cosineSim.predict("기쁨", "쓴맛","0~10", "ㄹ", "d", "w", "ㅐ")
print(type(reply))
cocktail_name = reply.name

# reply name 추가 가능하도록,
reply = reply.to_json(force_ascii=False, indent=4)
reply = json.loads(reply)
reply["이름"] = cocktail_name
reply = str(reply)
print(reply, type(reply))