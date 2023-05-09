import React, { useCallback, useState, useRef, useEffect } from "react";
import { StyleSheet, TouchableOpacity, FlatList, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { Card, Button } from 'react-native-elements';
import { auth, database } from '../config/firebase';
import url from '../url';
import { ScrollView } from "react-native-gesture-handler";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import {Dimensions} from 'react-native';

export default function Favorite({ navigation }) {
   
    const [data, setdata] = useState([]);
        
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

        fetch(url.flask + '/favorite', database_info)
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

   

  return (
    <View style={styles.container}>
        <View style={styles.row}>

            <TouchableOpacity
                onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color={colors.black} style={styles.backButton}/>
            </TouchableOpacity>

            <View>
                <Text style={styles.titletext}>즐겨찾기</Text>
            </View>

            <View>
                <AntDesign name="left" size={24} color={'white'} style={styles.backButton}/>
            </View>
        </View>

        <ScrollView>
        <View style={styles.wrap}>
        {data.map((item) =>(
                <TouchableOpacity onPress={() => navigation.navigate("Detail", 
                {
                    name:item.title,
                })} 
                key={item.title} >
                <Card 
                    containerStyle={{
                        padding:0, 
                        borderRadius:15, 
                        // paddingBottom: 7,
                        overflow: 'hidden',
                    }} 
                    key={item.title}>
                     <Card.Image style={{width: Dimensions.get('window').width*0.36, height: 150, tintColor: '#262628'}} 
                        source={require("../assets/backImage.png")}>
                            <Card.Image style={{ width: Dimensions.get('window').width*0.36, height: 150, tintColor: 'white'}} 
                                source={{uri: item.glass}}>
                                    <Card.Image style={{width:  Dimensions.get('window').width*0.36, height: 150, tintColor: item.color}}
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
    
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    background:{
        marginTop: 10,
        height:220,
    },
    centercontainer:{
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailtext: {
        flex: 1,
        alignItems:"center",
        textAlign: "center",
    },
    backButton: {
        size: 16,
        // marginTop: 50,
        marginLeft: 10,
    },
    cocktailGlass: {
        marginTop: 10,
        width: 200, 
        height: 190,
    },
    titletext:{
        // marginTop: 10,
        // marginBottom: 5,
        fontSize: 22,
        fontWeight: 'bold',
        // alignItems: 'center',
    },
    subtext:{
        marginTop:25, 
        marginLeft:20,
        fontSize: 18,
        fontWeight: 'bold',
    },
    text:{ 
        marginTop:5, 
        marginLeft:20,
        marginRight:20,
        fontSize: 18,
    },
    row: {
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 7,
    },
    wrap: {
        left: Dimensions.get('window').width*0.025,
        right: Dimensions.get('window').width*0.025,
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 15,
    }
});
