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


  export default function Chat() {

    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();
    const FIRST_MSG = "어떤 음식을 먹어볼까요?";
    const MSG = "";

    // useEffect(() => {
    //     setMessages([
    //       {
    //         _id: 1,
    //         text: FIRST_MSG,
    //         createdAt: new Date(),
    //         user: 'BOT_USER',
    //       },
    //     ]);
    //     addDoc(collection(database, auth?.currentUser?.email), {
    //         _id:1,
    //         createdAt: new Date(),
    //         text:FIRST_MSG,
    //         user:'BOT_USER'
    //       });
    //   }, []);

    // ChatScreen Header
    function LogoTitle() {
      return (
        <View>
        <ImageBackground
          style={{ width: '100%', height: 180 }}
          source={require('../assets/backImage2.png')}
        >
          <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
            >
          <AntDesign name="left" size={24} color={colors.gray} style={styles.backButton}/>
          </TouchableOpacity>
        </ImageBackground>
        </View>
      );
    }


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
              user: doc.data().user
            }))
          );
        });
    return unsubscribe;
      }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages)
        );
        // setMessages([...messages, ...messages]);

        const { _id, createdAt, text, user } = messages[0];    
        addDoc(collection(database, auth?.currentUser?.email), {
          _id,
          createdAt,
          text,
          user
        });

        const message_info = {
          method: "POST",
          body: JSON.stringify({
            message: messages[0],
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
        fetch("http://172.30.1.28:5001/message", message_info)
          .then((response) => response.json())
          .then((response) => {
            if (response.result === "success") {
                sendBotResponse(response.reply);
            } else alert("sendBot ERROR");
          });
      },
      [messages]
    );


    const sendBotResponse = (text) => {
      let msg = {
        _id: Date.now(),
        text,
        createdAt: new Date(),
        user: 'BOT_USER',
      };
      setMessages((previousMessages) => GiftedChat.append(previousMessages, msg));
      addDoc(collection(database, auth?.currentUser?.email), {
        _id:  Date.now(),
        text,
        createdAt: new Date(),
        user: 'BOT_USER',
      });
    };


    const renderSend = (props) => {
        return(
            <Send {...props}>
                <View>
                    <MaterialCommunityIcons name='send-circle' style={{marginBottom:5,marginRight:5}} size={36} />
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
        <View style={{flex:1}}>
          <View>
            <LogoTitle/>
          </View>
          <GiftedChat
            placeholder={'메세지를 입력하세요...'}
            messages={messages}
            showAvatarForEveryMessage={false}
            showUserAvatar={false}
            onSend={messages => onSend(messages)}
            alwaysShowSend
            renderSend={renderSend }
            messagesContainerStyle={{
              // backgroundColor: '#fff'
            }}
            textInputStyle={{
              // backgroundColor: '#fff',
              borderRadius: 20,
            }}
            renderAvatar={props => {
              return( <View/>
            )
            }}
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
      size:16,
      marginTop: 50, 
      marginLeft: 10,
      color: '#fff', 
      width:100, 
      height: 100
    }
  });


