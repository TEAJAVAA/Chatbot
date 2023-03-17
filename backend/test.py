from cosine import CosineSimilarity
import pandas as pd
import json

cosineSim=CosineSimilarity()
reply = cosineSim.predict("0~10", "레몬이나", "우울할때 마실 술 주세여", "샤워후에 마실 수 있는게 있을까요?", "레몬의 신맛이 담겼으면 좋겠어요.")

cocktail_name = reply.name

# reply name 추가 가능하도록,
reply = reply.to_json(force_ascii=False, indent=4)
reply = json.loads(reply)
reply["이름"] = cocktail_name
reply = str(reply)
print(reply, type(reply))