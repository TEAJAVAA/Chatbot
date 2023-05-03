import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback
} from 'react';
import { SafeAreaView, StyleSheet, Image, View, TouchableOpacity, Text, ScrollView} from 'react-native';
import { Card, Button } from 'react-native-elements';
import { ChatHeaderBar, GiftedChat, Bubble, Send, MessageImage } from 'react-native-gifted-chat';
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
import url from '../url';
import { Header } from 'react-native/Libraries/NewAppScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


// import {url} from '../App.js';

const backImage = require("../assets/backImage2.png");

//For testing
const cocktailImage = require("../assets/redcocktailimage.png");
const testurl = "https://github.com/unul09/imageupload/blob/main/dog.png?raw=true";
// const url = "http://10.200.160.102:5001";


export default function Chat() {

    const [N, setN] = useState(0);
    const [info, setInfo] = useState([]);
    const [messages, setMessages] = useState([]);
    // const [state, setState] = useState("true");
    const navigation = useNavigation();
    const FEEL_MSG = "오늘 기분이 어떠신가요?";
    const [FM1, setFM1] = useState("");
    const [FM2, setFM2] = useState("");
    const TASTE_MSG = "무슨 맛을 원하세요?";
    const RATE_MSG = "도수는 어느 정도로 원하시나요?";
    const INGRI_MSG = "어떤 재료를 선호하시나요?";
    const EXTRA_MSG = "추가로 하고 싶은 말씀이 있나요?";
    const [isTyping, setIsTyping] = useState(false);

    const f1 = "식사는 뭐로 하셨나요?";
    const f2 = "오늘 하루 어떠셨나요?";
    const f3 = "연애는 잘 되어가고 있으신가요?";
    const f4 = "오늘 날씨는 어떤가요?";
    const f5 = "오늘 무엇을 하셨나요?";
    const f6 = "요즘 어떻게 지내시나요?";
    const f7 = "무슨 고민이라도 있으신가요?";
    const f8 = "학교나 직장 생활은 어떠신가요?";
    const f9 = "요즘 하시는 취미활동이 있으신가요?";
    const f10 = "술은 평소에 즐기시는 편인가요?";
    const f11 = "어떤 음식을 좋아하시나요?";
    const f12 = "당신의 성격은 어떤가요?";
    const f13 = "좋아하는 거 아무거나 말씀해 주세요!";
    const f14 = "지금 딱 생각나는 색이 있으신가요? 무엇인가요?";

    const [starRating, setStarRating] = useState(null);
    const [shouldShow, setShouldShow] = useState(null);



    // loading
    const renderFooter = (props) => {
        if (isTyping==true)
        {
            return (
                
                <View>
                    <Image source={require('../assets/textanimation.gif')} 
                    style={styles.dotanimation}
                    isTyping={isTyping}
                    /> 
                </View>
            )
        }
       
    }

    const randomQuestion = (props) =>{
        let array = [f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12, f13, f14];
        array.sort(() => Math.random() - 0.5);
        // console.log(array);
        
        let a = array[0];
        let b = array[1];

        // console.log(a);

        setFM1(a)
        setFM2(b)
    }

    const starRateCollection = (score) => {
        addDoc(collection(database, 'score'), {
            score: score
        });
    }

    // App code start
    useEffect(() => {
        if (N == 0) {
            randomQuestion();
            info[0] = "feel";
            setN(N + 1);
            setIsTyping(false);
            setMessages([
                {
                    _id: Date.now(),
                    // image: testurl,
                    text: FEEL_MSG,
                    createdAt: new Date(),
                    user: 'BOT_USER',
                },
            ]);
            addDoc(collection(database, auth?.currentUser?.email), {
                _id: Date.now(),
                // image: testurl,
                createdAt: new Date(),
                text: FEEL_MSG,
                user: 'BOT_USER',
            });
        }
    }, []);



    useLayoutEffect(() => {

        const collectionRef = collection(database, auth?.currentUser?.email);
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, querySnapshot => {
            // console.log('querySnapshot unsusbscribe');
            setMessages(
                querySnapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    image: doc.data().image,
                    user: doc.data().user,
                    isOptions: doc.data().isOptions,
                    data: doc.data().data,
                }))
            );
        });
        return unsubscribe;
    }, []);


    // User sends message
    const onSend = useCallback((messages = []) => {
        setN(N + 1);

        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages)
        );
        // setMessages([...messages, ...messages]);

        const { _id, createdAt, text, user } = messages[0];

        // User Info
        if (N == 1) {
            addDoc(collection(database, auth?.currentUser?.email), {
                _id,
                info: "feel",
                createdAt,
                text,
                user
            });
            info[0] = "feel";
        }
        else if (N == 2) {
            addDoc(collection(database, auth?.currentUser?.email), {
                _id,
                info: "free1",
                createdAt,
                text,
                user
            });
            info[0] = "free1";
        }
        else if (N == 3) {
            addDoc(collection(database, auth?.currentUser?.email), {
                _id,
                info: "free2",
                createdAt,
                text,
                user
            });
            info[0] = "free2";
        }
        else if (N == 4) {
            addDoc(collection(database, auth?.currentUser?.email), {
                _id,
                info: "taste",
                createdAt,
                text,
                user
            });
            info[0] = "taste";
        }
        else if (N == 5) {
            addDoc(collection(database, auth?.currentUser?.email), {
                _id,
                info: "rate",
                createdAt,
                text,
                user
            });
            info[0] = "rate";
        }
        else if (N == 6) {
            addDoc(collection(database, auth?.currentUser?.email), {
                _id,
                info: "ingedient",
                createdAt,
                text,
                user
            });
            info[0] = "ingredient";
        }
        else if (N == 7) {
            setShouldShow(true);
            addDoc(collection(database, auth?.currentUser?.email), {
                _id,
                info: "extra",
                createdAt,
                text,
                user
            });
            setInfo("extra");
            info[0] = "extra";
        }


        const message_info = {
            method: "POST",
            body: JSON.stringify({
                message: messages[0],
                information: info[0],
                user: auth?.currentUser?.email
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };
        setIsTyping(true);
        
        fetch(url.flask + "/message", message_info)
            
            .then((response) => response.json())
            .then((response) => {
                if (response.result === "success") {
                    setIsTyping(false);
                    sendBotResponse(response.reply);
                    if (response.cocktail1) {
                        //sendBotResponse(response.cocktail1)
                        //sendBotResponse(response.cocktail2)
                        //sendBotResponse(response.cocktail3)
                        setIsTyping(false);
                        sendBotCocktail(response.cocktail1, response.cocktail2, response.cocktail3);
                    }
                } else alert("sendBot ERROR");
            });
    },
        [messages]
    );

    // Chatbot Responds
    const sendBotCocktail = (c1, c2, c3) => {
        let msg = {
            _id: Date.now(),
            // text,
            createdAt: new Date(),
            user: 'BOT_USER',
            isOptions: true,
            data: [
                {
                    // 토핑정보는 c1[8]에 ... 토핑 없을경우 null값으로 전달됨
                    title: c1[0],
                    glass: 'https://github.com/unul09/imageupload/blob/main/glass' + c1[7] + '.png?raw=true',
                    content: 'https://github.com/unul09/imageupload/blob/main/content' + c1[7] + '.png?raw=true',
                    color: c1[3]
                },
                {
                    title: c2[0],
                    glass: 'https://github.com/unul09/imageupload/blob/main/glass' + c2[7] + '.png?raw=true',
                    content: 'https://github.com/unul09/imageupload/blob/main/content' + c2[7] + '.png?raw=true',
                    color: c2[3]
                },
                {
                    title: c3[0],
                    glass: 'https://github.com/unul09/imageupload/blob/main/glass' + c3[7] + '.png?raw=true',
                    content: 'https://github.com/unul09/imageupload/blob/main/content' + c3[7] + '.png?raw=true',
                    color: c3[3]
                },
            ]
        };
        setMessages((previousMessages) => GiftedChat.append(previousMessages, msg));
        addDoc(collection(database, auth?.currentUser?.email), {
            _id: Date.now(),
            // text,
            createdAt: new Date(),
            user: 'BOT_USER',
            isOptions: true,
            data: [
                {
                    // 토핑정보는 c1[8]에 ... 토핑 없을경우 null값으로 전달됨
                    title: c1[0],
                    glass: 'https://github.com/unul09/imageupload/blob/main/glass' + c1[7] + '.png?raw=true',
                    content: 'https://github.com/unul09/imageupload/blob/main/content' + c1[7] + '.png?raw=true',
                    color: c1[3]
                },
                {
                    title: c2[0],
                    glass: 'https://github.com/unul09/imageupload/blob/main/glass' + c2[7] + '.png?raw=true',
                    content: 'https://github.com/unul09/imageupload/blob/main/content' + c2[7] + '.png?raw=true',
                    color: c2[3]
                },
                {
                    title: c3[0],
                    glass: 'https://github.com/unul09/imageupload/blob/main/glass' + c3[7] + '.png?raw=true',
                    content: 'https://github.com/unul09/imageupload/blob/main/content' + c3[7] + '.png?raw=true',
                    color: c3[3]
                },
            ]
        });
    };

    // Chatbot Responds
    const sendBotResponse = (text) => {

        let msg = {
            _id: Date.now(),
            text,
            createdAt: new Date(),
            user: 'BOT_USER',
        };
        setMessages((previousMessages) => GiftedChat.append(previousMessages, msg));
        addDoc(collection(database, auth?.currentUser?.email), {
            _id: Date.now(),
            text,
            createdAt: new Date(),
            user: 'BOT_USER',
        });
        setTimeout(function () {
            // Something you want delayed.
            if (N == 1) {
                sendBotQuestion(FM1);
            }
            else if (N == 2) {
                sendBotQuestion(FM2);
            }
            else if (N == 3) {
                sendBotQuestion(TASTE_MSG);
            }
            else if (N == 4) {
                sendBotQuestion(RATE_MSG);
            }
            else if (N == 5) {
                sendBotQuestion(INGRI_MSG);
            }
            else if (N == 6) {
                sendBotQuestion(EXTRA_MSG);
            }
        }, 1000);

    };

    // Chatbot asks question
    const sendBotQuestion = (botquestion) => {
        setIsTyping(false);
        let msg = {
            _id: Date.now(),
            text: botquestion,
            createdAt: new Date(),
            user: 'BOT_USER',
        };
        setMessages((previousMessages) => GiftedChat.append(previousMessages, msg));
        addDoc(collection(database, auth?.currentUser?.email), {
            _id: Date.now(),
            text: botquestion,
            createdAt: new Date(),
            user: 'BOT_USER',
        });
    }


    // Send Button Style
    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View>
                    <MaterialCommunityIcons name='send-circle' style={{ marginBottom: 5, marginRight: 5 }} size={36} />
                </View>
            </Send>
        );
    }

    // Message Image Button Style
    const renderMessageImage =(props) => {
        return (
          <MessageImage
            {...props}
            imageStyle={{
              width: '98%',
              resizeMode: 'cover'
            }}
          />
        )}

    return (
        // <>
        //   {messages.map(message => (
        //     <Text key={message._id}>{message.text}</Text>
        //   ))}
        // </>
        // <Image source={backImage} style={styles.backImage} />
        <View style={{ flex: 1 }}>
            <View>
                <ImageBackground
                    style={{ width: '100%', height: 180 }}
                    source={require('../assets/backImage2.png')}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Home")}
                    >
                        <AntDesign name="left" size={24} color={colors.gray} style={styles.backButton} />
                    </TouchableOpacity>
                </ImageBackground>
            </View>
            <GiftedChat
                placeholder={'메세지를 입력하세요...'}
                messages={messages}
                showAvatarForEveryMessage={true}
                showUserAvatar={false}
                onSend={messages => onSend(messages)}
                alwaysShowSend
                renderSend={renderSend}
                renderMessageImage={renderMessageImage}
                messagesContainerStyle={{
                    // backgroundColor: '#fff'
                }}
                textInputStyle={{
                    // backgroundColor: '#fff',
                    borderRadius: 20,
                }}
                renderAvatar={() => null}
                renderFooter={renderFooter}
                isTyping={isTyping}
                renderBubble={props => {
                    // Show cocktails in card
                    if(props.currentMessage.isOptions){
                        return (
                            <View>
                             <ScrollView showsHorizontalScrollIndicator={false} style={{backgroundColor: 'white'}}
                            horizontal={true}>
                                {props.currentMessage.data.map((item) => (
                                    <TouchableOpacity onPress={() => navigation.navigate("Detail", 
                                    {
                                        name:item.title,
                                    })}
                                    key={item.title}>
                                    <Card 
                                        containerStyle={{
                                            padding:0, 
                                            borderRadius:15, 
                                            // paddingBottom: 7,
                                            overflow: 'hidden',
                                            marginBottom: 15
                                        }} 
                                        key={item.title}>
                                            <Card.Image style={{width: 160, height: 150, tintColor: '#262628'}} 
                                            source={require("../assets/backImage.png")}>
                                                <Card.Image style={{width: 160, height: 150, tintColor: 'white'}} 
                                                source={{uri: item.glass}}>
                                                    <Card.Image style={{width: 160, height: 150, tintColor: item.color}}
                                                    // resizeMode="cover"
                                                    source={{uri: item.content}}>
                                                        {/* <Card.Image style={{width: 100, height: 100, tintColor: '#b22222'}} 
                                                        source={require("/Users/huijing/reactnative/frontend/assets/backImage2.png")}>
                                                        </Card.Image> */}
                                                    </Card.Image>
                                                </Card.Image>
                                            </Card.Image>
                                        <View style={{backgroundColor:'#eeeeee'}}>
                                        <Card.Divider/>
                                        <Card.Title style={{backfontSize:16}}>{item.title}</Card.Title>
                                        </View>
                                    </Card>
                                    </TouchableOpacity>
                                    
                                ))}
                            </ScrollView>
                           
                            
                            <View style={styles.whitecontainer}>
                                <Text style={styles.startext}> 추천은 어떠셨나요? 별점을 남겨주세요.</Text>
                                <View style={styles.stars}>
                                    
                                    <TouchableOpacity onPress={() => setStarRating(1)} activeOpacity={1}>
                                        <AntDesign 
                                        name={starRating >= 1 ? "star" : "staro"} 
                                        size={30} 
                                        style={starRating >= 1 ? styles.starSelected : styles.starUnselected}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setStarRating(2)} activeOpacity={1}>
                                        <AntDesign
                                        name={starRating >= 2 ? "star" : "staro"} 
                                        size={30} 
                                        style={starRating >= 2 ? styles.starSelected : styles.starUnselected}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setStarRating(3)} activeOpacity={1}>
                                        <AntDesign 
                                        name={starRating >= 3 ? "star" : "staro"} 
                                        size={30} 
                                        style={starRating >= 3 ? styles.starSelected : styles.starUnselected}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setStarRating(4)} activeOpacity={1}>
                                        <AntDesign
                                        name={starRating >= 4 ? "star" : "staro"} 
                                        size={30} 
                                        style={starRating >= 4 ? styles.starSelected : styles.starUnselected}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setStarRating(5)} activeOpacity={1}>
                                        <AntDesign
                                        name={starRating >= 5 ? "star" : "staro"} 
                                        size={30} 
                                        style={starRating >= 5 ? styles.starSelected : styles.starUnselected}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {starRateCollection(starRating); setShouldShow(false)}}>
                                        {shouldShow ? (
                                        <AntDesign name="checkcircle" size={26} style={{paddingTop: 2, paddingLeft: 10}}/>
                                        ) : null}
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            </View>
                        )
                    }

                    return (
                        <Bubble
                            {...props}
                            wrapperStyle={{
                                left: {
                                    backgroundColor: '#fff',
                                },
                                right: {
                                    backgroundColor: '#000000'
                                }
                            }}
                        />
                    )
                }}
                user={{
                    _id: auth?.currentUser?.email
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 10,
        justifyContent: 'center'
    },
    backImage: {
        width: "100%",
        height: 340,
        // position: "absolute",
        top: 0,
        resizeMode: 'cover',
    },
    backButton: {
        size: 16,
        marginTop: 50,
        marginLeft: 10,
        color: '#fff',
        width: 100,
        height: 100,
    },
    dotanimation: {
        left: 20,
        width:65,
        height:30,
        borderRadius: 150 / 2,
        overflow: "hidden",
        bottom:10
    },
    customRatingBarStyle: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 30
    },
    stars: {
        display: 'flex',
        flexDirection: 'row',
    },
    starUnselected: {
        paddingLeft: 5,
        paddingRight: 8,
        color: '#aaa',
    },
    starSelected: {
        paddingLeft: 5,
        paddingRight: 8,
        color: '#ffae42',
    },
    whitecontainer: {
        marginTop: 2,
        padding: 8,
        width: 310,
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    startext:{
        fontSize: 16,
        marginBottom: 5,
    }
});

