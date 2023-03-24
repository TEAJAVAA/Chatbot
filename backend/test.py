import pandas as pd

data = input("검색: ")
message = data
coc_data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False)
coc_data = coc_data.drop(columns=['신맛내는거', '맛','키워드', 'Unnamed: 10','신맛내는거 포함 문자열'], axis=1)

coc_data[coc_data['레시피*'].str.contains('보드카')]

coc_data[coc_data['이름*'].str.contains('보드카')]

coc_result = coc_data[coc_data['이름*'].str.contains(message) | coc_data['레시피*'].str.contains(message)]

print(coc_result)
