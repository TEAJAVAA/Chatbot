import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
import url from '../url';
// const url = "http://10.200.160.102:5001";

// import {url} from '../App.js';

const Detail = ({ route, navigation }) => {

    // const navigation = useNavigation();
    const {name} = route.params;

    const [info, setInfo] = useState({
        base: null,
        taste: null,
        degree: null,
        recipe: null,
        about: null,
        glass: null,
        content: null,
        color: null,
    });


    useEffect(() => {
        const name_info = {
            method: "POST",
            body: JSON.stringify({
                name: ({name}.name)
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };

        fetch(url.flask + "/detail", name_info)
            .then((response) => response.json())
            .then((response) => {
                // console.log(response.cocktail[0].base);
                setInfo({
                    base: response.cocktail[0].base,
                    taste: response.cocktail[0].sweet,
                    degree: response.cocktail[0].degree,
                    recipe: response.cocktail[0].recipe,
                    about: response.cocktail[0].info,
                    glass: "https://github.com/unul09/imageupload/blob/main/glass" + response.cocktail[0].glass + ".png?raw=true",
                    content: "https://github.com/unul09/imageupload/blob/main/content" + response.cocktail[0].glass + ".png?raw=true",
                    color: response.cocktail[0].color,
                });
            });
    },
        []
        // [info]
    );

    // const { base, taste, degree, recipe, about, glass, content, color } = info;


    return (
        <View style={styles.container}>

            <View style={styles.row}>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                        <AntDesign name="left" size={24} color={colors.black} style={styles.backButton}/>
                </TouchableOpacity>

                <View>
                    <Text style={styles.titletext}>{name}</Text>
                </View>
                
                <TouchableOpacity
                    // onPress={() => navigation.goBack()}
                    >
                        <AntDesign name="heart" size={24} color={colors.black} style={{right:15}}/>
                </TouchableOpacity>
            </View>

            <ImageBackground source={require('../assets/color.jpeg')} style={styles.background}>
                <View style={styles.centercontainer}>
                    <ImageBackground source={{uri:info.glass || null}} 
                    style={styles.cocktailGlass}
                    >
                        <Image source={{uri:info.content || null}} 
                        style={{tintColor: info.color, width: 200, height: 190,}}
                        >
                        </Image>
                    </ImageBackground>
                </View>
            </ImageBackground>

            <Text style={styles.subtext}>설명:</Text>
            <Text style={styles.text}>{info.about}</Text>
            <Text style={styles.subtext}>레시피:</Text>
            <Text style={styles.text}>{info.recipe}</Text>
            <Text style={styles.subtext}>당도:</Text>
            <Text style={styles.text}>{info.taste}</Text>
            <Text style={styles.subtext}>도수:</Text>
            <Text style={styles.text}>{info.degree}</Text>
            <Text style={styles.subtext}>베이스:</Text>
            <Text style={styles.text}>{info.base}</Text>
        </View>

    );
}

    export default Detail;

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
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    detailtext: {
        flex: 1,
        alignItems:"center",
        textAlign: "center",
    },
    backButton: {
        size: 16,
        // marginTop: 15,
        marginLeft: 10,
    },
    cocktailGlass: {
        marginTop: 10,
        width: 200, 
        height: 190,
    },
    cocktailContent: {
        width: 200, 
        height: 190,
        tintColor: colors,
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
    }
});
