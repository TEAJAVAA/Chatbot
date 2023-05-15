import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import math
from konlpy.tag import Okt

resultData = pd.read_csv("dataset/cocResult2.csv", index_col=0)
data = pd.read_csv('dataset/칵테일 데이터 최종 (1).csv', low_memory=False)
data = data.drop(columns=['sour', 'taste','keyword', 'Unnamed: 10','sourstring'], axis=1)
okt = Okt()
explanation=list(data['info'])
for i in range(len(explanation)):
    explanation[i] = okt.nouns(explanation[i]) 
    explanation[i] = ', '.join(s for s in explanation[i])
data['info_revised']=explanation

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



class CosineSimilarity():
    def __init__(self):
        self.data=data
        
    def cos_similarity(self,v1, v2):
            dot_product = np.dot(v1, v2)
            l2_norm = (np.sqrt(sum(np.square(v1))) * np.sqrt(sum(np.square(v2))))
            if l2_norm==0:
                similarity=0
            else:
                similarity = dot_product/l2_norm     
            return similarity
    
    def calculate_degree(self, degree):
        if (degree=='무알콜'):
            self.result_cluster.loc[self.result_cluster['degree'] == 0, 'point'] +=1
        elif (degree=='0~10'):
            self.result_cluster.loc[(self.result_cluster['degree'] > 0) & (self.result_cluster['degree'] <=10), 'point'] +=1
        elif (degree=='10~20'):
            self.result_cluster.loc[(self.result_cluster['degree'] > 10) & (self.result_cluster['degree'] <=20), 'point'] +=1
        else:
            self.result_cluster.loc[self.result_cluster['degree'] > 20, 'point'] +=1

    def calculate_ingredient(self,ingredient_input):
        text = ingredient_input
        recipedata = okt.nouns(text)
        recipedata = ', '.join(s for s in recipedata)
        recipe_list=list(self.result_cluster['recipe'])
        recipe_list.append(recipedata)
        sim_list= self.cosine_calcultate(recipe_list)
        '''if math.isnan(sim_list[1]):
            self.result_cluster['재료유사도'] = 0
        else :'''
        self.result_cluster['재료유사도'] = sim_list
        self.result_cluster.loc[self.result_cluster['degree'] >=0, 'point'] +=(self.result_cluster['재료유사도']*3)
    

    def calculate_talk(self, free_talk1, free_talk2, etc_input):
        explanation_temp=list(self.result_cluster['info_revised'])
        ex = okt.nouns(free_talk1+free_talk2+etc_input)
        ex= ', '.join(s for s in ex)
        explanation_temp.append(ex)
        sim_list= self.cosine_calcultate(explanation_temp)
        self.result_cluster['대화 유사도'] = sim_list
        self.result_cluster.loc[self.result_cluster['degree'] >=0, 'point'] +=self.result_cluster['대화 유사도']

    def predict(self, feel_input, taste_input, degree, ingredient_input,free_talk1, free_talk2, etc_input):
        if(feel_input=='기쁨'):
            if(taste_input=='단맛'):
                self.result_cluster = pd.concat([cluster1,cluster9,cluster10])
            elif(taste_input=='신맛'):
                self.result_cluster = pd.concat([cluster3,cluster5,cluster10])
            else:
                self.result_cluster = pd.concat([cluster3,cluster5,cluster6])

        elif(feel_input=='슬픔' or feel_input=='불안' or feel_input=='상처'):
            if(taste_input=='단맛'):
                self.result_cluster = pd.concat([cluster9,cluster10])
            elif(taste_input=='신맛'):
                self.result_cluster = pd.concat([cluster3,cluster7,cluster10])
            else:
                self.result_cluster = pd.concat([cluster2,cluster5,cluster7])

        else:
            if(taste_input=='단맛'):
                self.result_cluster = pd.concat([cluster2,cluster9,cluster10])
            elif(taste_input=='신맛'):
                self.result_cluster = pd.concat([cluster3,cluster7])
            else:
                self.result_cluster = pd.concat([cluster4,cluster8])
                
        self.result_cluster['point'] = 0
        self.calculate_degree(degree)
        self.calculate_ingredient(ingredient_input)
        self.calculate_talk(free_talk1, free_talk2, etc_input)
        
        idx=self.result_cluster['point'].nlargest(3)
        idx1 = idx.index[0]
        idx2 = idx.index[1]
        idx3 = idx.index[2]

        cocktail1=data.loc[idx1]
        cocktail2=data.loc[idx2] 
        cocktail3=data.loc[idx3]
        return (cocktail1, cocktail2, cocktail3)
        
    def predictItem(self, docId):
        self.result_cluster=pd.concat([cluster1,cluster2,cluster3, cluster4,cluster5,cluster6,cluster7, cluster8,cluster9, cluster10])
        origin_item=self.result_cluster[self.result_cluster['name']==docId]
        self.result_cluster.drop(self.result_cluster[self.result_cluster['name']==docId].index, axis=0, inplace=True)
        self.result_cluster['point'] = 0
        degree=origin_item.iloc[0]['degree']
        if (degree==0):
            degree_result='무알콜'
        elif (degree>0 and degree <=10):
            degree_result='0~10'
        elif (degree>10 and degree <=20):
            degree_result='10~20'
        else:
            degree_result='20~'
        
        self.calculate_degree(degree_result)
        self.calculate_ingredient(origin_item.iloc[0]['recipe'])
        
        explanation_temp=list(self.result_cluster['info_revised'])
        explanation_temp.append(origin_item.iloc[0]['info_revised'])
        sim_list= self.cosine_calcultate(explanation_temp)
        self.result_cluster['대화 유사도'] = sim_list
        self.result_cluster.loc[self.result_cluster['degree'] >=0, 'point'] +=self.result_cluster['대화 유사도']
        idx=self.result_cluster['point'].nlargest(3)
        idx1 = idx.index[0]
        idx2 = idx.index[1]
        idx3 = idx.index[2]
        cocktail1=data.loc[idx1]
        cocktail2=data.loc[idx2] 
        cocktail3=data.loc[idx3]
        return (cocktail1, cocktail2, cocktail3)
    
    def cosine_calcultate(self, doc_list):
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
        doc_list.pop()
        return sim_list
        






