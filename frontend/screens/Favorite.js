import React, { useCallback, useState, useRef, useEffect } from "react";
import { StyleSheet, TouchableOpacity, FlatList, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { Card, Button } from 'react-native-elements';

export default function Favorite({ navigation }) {
    const data = [
        {
            title: "하바나 비치",
            glass: "https://github.com/unul09/imageupload/blob/main/glass2.png?raw=true",
            content: "https://github.com/unul09/imageupload/blob/main/content2.png?raw=true",
            color: "#dfdcd4",
            },
        {
            title: "파인애플 피즈",
            glass: "https://github.com/unul09/imageupload/blob/main/glass5.png?raw=true",
            content: "https://github.com/unul09/imageupload/blob/main/content5.png?raw=true",
            color: "#c59c19",
            },
    ]
        
    

   

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
                     <Card.Image style={{width: 160, height: 150, tintColor: '#262628'}} 
                        source={require("../assets/backImage.png")}>
                            <Card.Image style={{width: 160, height: 150, tintColor: 'white'}} 
                                source={{uri: item.glass}}>
                                    <Card.Image style={{width: 160, height: 150, tintColor: item.color}}
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 15,
    }
});
