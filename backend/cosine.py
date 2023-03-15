import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from konlpy.tag import Okt

resultData = pd.read_csv("dataset/coc_result.csv의 사본")
resultData=resultData.drop(['Unnamed: 0'], axis=1)
data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False, index_col=0)
data = data.drop(columns=['신맛내는거', '맛','키워드', 'Unnamed: 10','신맛내는거 포함 문자열'], axis=1)
dummy = data
Cluster1_list = list(resultData[resultData.cluster == 0].data_index)
cluster1 = dummy.loc[Cluster1_list]
Cluster2_list = list(resultData[resultData.cluster == 1].data_index)
cluster2 = dummy.loc[Cluster2_list]
Cluster3_list = list(resultData[resultData.cluster == 2].data_index)
cluster3 = dummy.loc[Cluster3_list]
Cluster4_list = list(resultData[resultData.cluster == 3].data_index)
cluster4 = dummy.loc[Cluster4_list]
Cluster5_list = list(resultData[resultData.cluster == 4].data_index)
cluster5 = dummy.loc[Cluster5_list]
Cluster6_list = list(resultData[resultData.cluster == 5].data_index)
cluster6 = dummy.loc[Cluster6_list]
Cluster7_list = list(resultData[resultData.cluster == 6].data_index)
cluster7 = dummy.loc[Cluster7_list]
Cluster8_list = list(resultData[resultData.cluster == 7].data_index)
cluster8 = dummy.loc[Cluster8_list]
Cluster9_list = list(resultData[resultData.cluster == 8].data_index)
cluster9 = dummy.loc[Cluster9_list]
Cluster10_list = list(resultData[resultData.cluster == 9].data_index)
cluster10 = dummy.loc[Cluster10_list]

class CosineSimilarity():
    def __init__(self):
        self.initialize()

    def initialize(self, ):
        self.data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False, index_col=0)
        #resultdata가 군집화 결과물
        self.data = self.data.drop(columns=['신맛내는거', '맛','키워드', 'Unnamed: 10','신맛내는거 포함 문자열'], axis=1)
        

    def cos_similarity(self,v1, v2):
            dot_product = np.dot(v1, v2)
            l2_norm = (np.sqrt(sum(np.square(v1))) * np.sqrt(sum(np.square(v2))))
            similarity = dot_product/l2_norm     
            return similarity
    
    def calculate_degree(self, degree):
        if (degree=='무알콜'):
            self.result_cluster.loc[self.result_cluster['도수*'] == 0, 'point'] +=1
        elif (degree=='0~10'):
            self.result_cluster.loc[(self.result_cluster['도수*'] > 0) & (self.result_cluster['도수*'] <=10), 'point'] +=1
        elif (degree=='10~20'):
            self.result_cluster.loc[(self.result_cluster['도수*'] > 10) & (self.result_cluster['도수*'] <=20), 'point'] +=1
        else:
            self.result_cluster.loc[self.result_cluster['도수*'] > 20, 'point'] +=1

    def calculate_ingredient(self,ingredient_input):
        okt = Okt()
        text = ingredient_input
        recipedata = okt.nouns(text)
        recipedata = ', '.join(s for s in recipedata)

        recipe_list=list(self.result_cluster['레시피*'])
        recipe_list.append(recipedata)
        doc_list = recipe_list
        tfidf_vect_simple = TfidfVectorizer()
        feature_vect_simple = tfidf_vect_simple.fit_transform(doc_list)

        sim_list = []
        feature_vect_dense = feature_vect_simple.todense()

        for i in range(len(feature_vect_dense)):
            vect1 = np.array(feature_vect_dense[len(feature_vect_dense)-1]).reshape(-1,)
            vect2 = np.array(feature_vect_dense[i]).reshape(-1,)
            similarity_simple = self.cos_similarity(vect1, vect2)
            sim_list.append(similarity_simple)

        sim_list.pop()
        recipe_list.pop()

        self.result_cluster['재료유사도'] = sim_list
        self.result_cluster.loc[self.result_cluster['도수*'] >=0, 'point'] +=(self.result_cluster['재료유사도']*3)

    def calculate_talk(self, free_talk1, free_talk2, etc_input):
        okt = Okt()
        explanation=list(self.result_cluster['설명*'])
        for i in range(len(explanation)):
            explanation[i] =str(explanation[i])
        explanation.append(free_talk1+free_talk2+etc_input)
        for i in range(len(explanation)):
            explanation[i] = okt.nouns(explanation[i])
            explanation[i] = ', '.join(s for s in explanation[i])
        doc_list = explanation

        tfidf_vect_simple = TfidfVectorizer()
        feature_vect_simple = tfidf_vect_simple.fit_transform(doc_list)

        sim_list = []
        feature_vect_dense = feature_vect_simple.todense()
        for i in range(len(feature_vect_dense)):
            vect1 = np.array(feature_vect_dense[len(feature_vect_dense)-1]).reshape(-1,)
            vect2 = np.array(feature_vect_dense[i]).reshape(-1,)
            similarity_simple = self.cos_similarity(vect1, vect2)
            sim_list.append(similarity_simple)

        sim_list.pop()
        explanation.pop()

        self.result_cluster['대화 유사도'] = sim_list
        self.result_cluster.loc[self.result_cluster['도수*'] >=0, 'point'] +=self.result_cluster['대화 유사도']

    def predict(self, degree, ingredient_input,free_talk1, free_talk2, etc_input):
        #여기서 모델 돌려서 군집이랑 연결시킴, 해서 군집 1,2산출됐다고 가정할게
        self.result_cluster = pd.concat([cluster1,cluster2])
        self.result_cluster['point'] = 0

        self.calculate_degree(degree)
        self.calculate_ingredient(ingredient_input)
        self.calculate_talk(free_talk1, free_talk2, etc_input)

        idx=self.result_cluster['point'].idxmax()
        cocktail=data.loc[idx]
        print(cocktail)
        return cocktail
        #cocktail.name, coctail[0]:당도, [1]:도수, [2]:색상, [3]:베이스, [4]:레시피, [5]:설명






