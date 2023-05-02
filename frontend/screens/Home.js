import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, Keyboard, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from "../config/firebase";
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import url from '../url';
import { Card, Button } from 'react-native-elements';

// export const url = ["http://10.200.3.220:5001"];


const Home = () => {

    const [data, setdata] = useState([]);

    const navigation = useNavigation();

    const onSignOut = () => {
        signOut(auth).catch(error => console.log('Error logging out: ', error));
      };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const database_info = {
                method: "POST",
                body: JSON.stringify({
                    user_favorite: auth?.currentUser?.email + "_favorite"
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
    
            fetch(url.flask + '/item', database_info)
                .then((response) => response.json())
                .then((response) => {
                    // console.log(response.cocktail[0].base);
                    // console.log(response.cocktails);
                    setdata(response.cocktails);
                    // console.log(data);
                });

        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

      
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity>
                <FontAwesome name="heart" size={24} color={'#fff'} style={{marginLeft: 15}}
                onPress={() => navigation.navigate("Favorite")}
                />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                  style={{
                    marginRight: 10
                  }}
                  onPress={onSignOut}
                >
                  <AntDesign name="logout" size={24} color={'#fff'} style={{marginRight: 10}}/>
                </TouchableOpacity>
              )
            });
    }, [navigation]);

    // useEffect(() => {
    //     const database_info = {
    //         method: "POST",
    //         body: JSON.stringify({
    //             user_favorite: auth?.currentUser?.email + "_favorite"
    //         }),
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     };

    //     fetch(url.flask + '/item', database_info)
    //         .then((response) => response.json())
    //         .then((response) => {
    //             // console.log(response.cocktail[0].base);
    //             console.log(response.cocktails);
    //             setdata(response.cocktails);
    //             // console.log(data);
    //         });
    // },
    //     []
    //     // [info]
    // );

    return (
        <View style={styles.container}>
            <ScrollView
            showsVerticalScrollIndicator={false}
            >
            <View style={styles.centercontainer}
            >
            <TouchableOpacity onPress={() => navigation.navigate("Search")} activeOpacity={1}>
                <Image style={styles.searchbutton} source={require('../assets/searchbar.jpeg')}/>
            </TouchableOpacity>
            </View>

            <Text style={styles.welcometext}>브로디의 칵테일 추천!</Text>

            <View style={styles.centercontainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Chat")} activeOpacity={1}>
                <Image style={styles.chatbtn} source={require('../assets/chatbutton4.png')}/>
            </TouchableOpacity>
            </View>

            <Text style={styles.welcometext2}>손님만을 위한 추천 칵테일</Text>

            <View style={{height: 200}}>
            <ScrollView showsHorizontalScrollIndicator={false} style={styles.scrollview}
                            horizontal={true}>
                <View style={styles.horizontal}>
                {data.map((item) =>(
                <TouchableOpacity onPress={() => navigation.navigate("Detail", 
                {
                    name:item.title,
                })} 
                key={item.title}  activeOpacity={1}>
                <Card 
                    containerStyle={{
                        padding:0, 
                        borderRadius:15, 
                        // paddingBottom: 7,
                        overflow: 'hidden',
                    }} 
                    key={item.title}>
                     <Card.Image style={{width: 140, height: 130, tintColor: '#262628'}} 
                        source={require("../assets/backImage.png")}>
                            <Card.Image style={{width: 140, height: 130, tintColor: 'white'}} 
                                source={{uri: item.glass}}>
                                    <Card.Image style={{width: 140, height: 130, tintColor: item.color}}
                                    source={{uri: item.content}}>
                                        
                                    </Card.Image>
                                </Card.Image>
                    </Card.Image>
                    <Card.Divider/>
                    <Card.Title style={{fontSize:16}}>{item.title}</Card.Title>
                </Card>
                </TouchableOpacity>
            ))}
            </View>
            </ScrollView>
            </View>

            <Text style={styles.welcometext2}>브로디와의 대화 타임</Text>
            <View style={{height: 18}}></View>
            <View style={styles.centercontainer}>
            <TouchableOpacity onPress={() => navigation.navigate("FreeChat")} activeOpacity={1}>
                <Image style={styles.chatbtn} source={require('../assets/freechatbutton.png')}/>
            </TouchableOpacity>
            </View>
            <View style={{height: 36}}></View>
        </ScrollView>
        </View>
    );
    };

    export default Home;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
        },
        chatButton: {
            // position:'fixed',
            backgroundColor: '#161346',
            height: 50,
            width: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#161346',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: .9,
            shadowRadius: 8,
            marginRight: 20,
            marginBottom: 50,
            right:10,
            bottom:20
        },
        centercontainer:{
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttoncontainer: {
            margin: 20,
        },
        searchbutton: {
            marginTop: 16,
            width: 415,
            height: 42,
        },
        welcometext: {
            margin: 20,
            marginTop: 40,
            marginBottom: 15,
            fontWeight: "bold",
            fontSize: 20,
        },
        welcometext2: {
            margin: 20,
            marginTop: 40,
            marginBottom: 0,
            fontWeight: "bold",
            fontSize: 20,
        },
        chatbtn: {
            borderRadius: 15,
            width: 380,
            height: 150,
        },
        scrollview: {
            backgroundColor: 'white',
        },
        horizontal: {
            flexDirection: 'row',
            height: 200,
        }
    });