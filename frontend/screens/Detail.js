import React, { useEffect, useLayoutEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';

const Detail = () => {

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate("Chat")}>
                    <AntDesign name="close" size={24} color={colors.black} style={styles.backButton} />
            </TouchableOpacity>
            <Image source={{uri:"https://github.com/unul09/imageupload/blob/main/cocktail1.png?raw=true"}} 
            style={{width: 200, height: 190}}
            >

            </Image>
        </View>
    );
    };

    export default Detail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
});
