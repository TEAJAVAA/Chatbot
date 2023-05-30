# AI를 활용한 칵테일 추천 챗봇 Broady 🍸

![그림1](https://github.com/TEAJAVAA/Chatbot/assets/88281367/b8526758-7e15-4dbb-bef3-2fc6b7b81c22)

## 🍹 프로젝트 소개

메뉴 선택의 어려움을 해결해주는 칵테일 검색 및 추천 서비스

AI를 활용하여 사용자의 취향과 입맛에 알맞는 칵테일을 추천해주고자함



## 주요 기능

### 1. 칵테일 추천 챗봇

브로디와 기분, 원하는 맛 등에 대한 대화를 나눈 후 칵테일 3개를 추천받음

![스크린샷 2023-05-31 오전 12.42.09.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/94ceab03-ff0f-4020-8d1d-68a13ee235cf/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2023-05-31_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_12.42.09.png)

1) ChatGPT를 통해 사용자와 상호작용

2) 사용자의 답변이 LSTM 모델에 들어가고, 모델 내에서 사용자는 특정 그룹으로 분류됨

3) 칵테일은 맛, 도수등의 특성에 따라 K-Means Clustering을 통해 군집화되어 있으며 이는 사용자 그룹과 매핑되어있는 상태

4) 사용자가 속한 그룹과 매핑되어 있는 칵테일 군집들을 모아 새로운 칵테일 그룹을 만듦

5) 사용자 답변 중 나머지를 사용해 위 그룹과의 cosine similarity를 구함

6) 최종적으로 유사도가 제일 높은 3개의 항목이 추천됨


### 2. 즐겨찾기 기반 추천

사용자가 좋아하는 칵테일을 즐겨찾기함에 담아 놓으면 이를 바탕으로 유사한 칵테일들을 홈화면에 띄워줌


### 3. 자유대화 챗봇

ChatGPT API로 바텐더와 일상적인 대화를 나누듯이 자유롭게 대화를 나눌 수 있음


### 4. 검색

칵테일의 이름뿐만 아니라 재료로도 검색을 할 수 있음



## 구현 구조도

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/270a1a6d-49c1-413a-89c6-c33274554f12/Untitled.png)

Frontend

- React Native
- Expo

Backend

- Python
- Flask

AI

- Tensorflow
- Keras
- Chat GPT


## 시연 영상

 🎥 https://www.youtube.com/watch?v=5EMY0fYMFeQ
