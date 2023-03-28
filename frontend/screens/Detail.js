import React, { useEffect, useLayoutEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
const url = "http://172.20.10.2:5001";

const Detail = ({ route, navigation }) => {

    // const navigation = useNavigation();
    const {name} = route.params;
    // const n = JSON.stringify({name}.name);
    const taste = "";
    const degree = "";
    const base = "";
    const recipe = "";
    const about = "";
    const glass = "";
    const content = "";
    const color = "";

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

        fetch(url + "/detail", name_info)
            .then((response) => response.json())
            .then((response) => {
                console.log(response.cocktail);
            });
    });

    



    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate("Chat")}>
                    <AntDesign name="close" size={24} color={colors.black} style={styles.backButton} />
            </TouchableOpacity>

            <View style={styles.centercontainer}>
            <Text style={styles.titletext}>{name}</Text>
            </View>

            <ImageBackground source={require('../assets/color.jpeg')} style={styles.background}>
                <View style={styles.centercontainer}>
                    <ImageBackground source={{uri:glass}} 
                    style={styles.cocktailGlass}
                    >
                        <Image source={{uri:content}} 
                        style={{tintColor: color, width: 200, height: 190,}}
                        >
                        </Image>
                    </ImageBackground>
                </View>
            </ImageBackground>

            {/* <Text style={styles.subtext}>설명:</Text>
            <Text style={styles.text}>{about}</Text>
            <Text style={styles.subtext}>레시피:</Text>
            <Text style={styles.text}>{recipe}</Text>
            <Text style={styles.subtext}>당도:</Text>
            <Text style={styles.text}>{taste}</Text>
            <Text style={styles.subtext}>도수:</Text>
            <Text style={styles.text}>{degree}</Text>
            <Text style={styles.subtext}>베이스:</Text>
            <Text style={styles.text}>{base}</Text> */}

        </View>
    );
    };

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
    },
    detailtext: {
        flex: 1,
        alignItems:"center",
        textAlign: "center",
    },
    backButton: {
        size: 16,
        marginTop: 15,
        marginLeft: 15,
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
        marginTop: 10,
        marginBottom: 5,
        fontSize: 22,
        fontWeight: 'bold',
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
    }
});
