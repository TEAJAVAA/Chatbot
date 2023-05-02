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

export default function FreeChat() {

    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();

    useLayoutEffect(() => {

        const collectionRef = collection(database, auth?.currentUser?.email + "_freechat");
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
        // console.log('querySnapshot unsusbscribe');
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
        addDoc(collection(database, auth?.currentUser?.email + "_freechat"), {
          _id,
          createdAt,
          text,
          user
        });
      }, []);

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
      height: 100,
  },
  dotanimation: {
      left: 20,
      width:65,
      height:30,
      borderRadius: 150 / 2,
      overflow: "hidden",
      bottom:10
  }
});
