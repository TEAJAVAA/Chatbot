import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback
} from 'react';
import { Button, SafeAreaView, StyleSheet, Image, View, TouchableOpacity, Text } from 'react-native';
import { ChatHeaderBar, GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
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
import { Header } from 'react-native/Libraries/NewAppScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ImageBackground } from 'react-native';
const backImage = require("../assets/backImage2.png");

//For testing
const cocktailImage = require("../assets/redcocktailimage.png");
const testurl = "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"


export default function Chat() {

    const [N, setN] = useState(0);
    const [info, setInfo] = useState([]);
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();
    const FEEL_MSG = "오늘 기분이 어떠신가요?";
    const FREE1_MSG = "MBTI가 뭐에요?";
    const FREE2_MSG = "여행 가보셨어요?";
    const TASTE_MSG = "무슨 맛을 원하세요?";
    const RATE_MSG = "도수는 어느 정도로 원하시나요?";
    const INGRI_MSG = "어떤 재료를 선호하시나요?";
    const EXTRA_MSG = "추가로 하고 싶은 말씀이 있나요?";


    // App code start
    useEffect(() => {
        if (N == 0) {
            info[0] = "feel";
            setN(N + 1);
            setMessages([
                {
                    _id: Date.now(),
                    image: testurl,
                    text: FEEL_MSG,
                    createdAt: new Date(),
                    user: 'BOT_USER',
                },
            ]);
            addDoc(collection(database, auth?.currentUser?.email), {
                _id: Date.now(),
                image: testurl,
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
            console.log('querySnapshot unsusbscribe');
            setMessages(
                querySnapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    image: doc.data().image,
                    user: doc.data().user,
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
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };

        fetch("http://10.200.3.220:5001/message", message_info)

            .then((response) => response.json())
            .then((response) => {
                if (response.result === "success") {
                    sendBotResponse(response.reply);
                } else alert("sendBot ERROR");
            });
    },
        [messages]
    );

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
                sendBotQuestion(FREE1_MSG);
            }
            else if (N == 2) {
                sendBotQuestion(FREE2_MSG);
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



    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View>
                    <MaterialCommunityIcons name='send-circle' style={{ marginBottom: 5, marginRight: 5 }} size={36} />
                </View>
            </Send>
        );
    }

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
                messagesContainerStyle={{
                    // backgroundColor: '#fff'
                }}
                textInputStyle={{
                    // backgroundColor: '#fff',
                    borderRadius: 20,
                }}
                renderAvatar={() => null}
                renderBubble={props => {
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
        height: 100
    }
});