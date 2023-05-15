import React, { useCallback, useState, useRef, useEffect } from "react";
import { StyleSheet, TouchableOpacity, FlatList, Text, View, ImageBackground, Image} from "react-native";
import * as Animatable from "react-native-animatable";
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import {Dimensions} from 'react-native';
import { SearchBar } from 'react-native-elements';

import url from '../url';

export default function Search({ navigation }) {
    
    const [info, setInfo] = useState([]);
    const searchRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("Home")}
                >
                    <AntDesign name="left" size={24} style={styles.backButton} />
                </TouchableOpacity>
            ),
            });
    }, [navigation]);


    const searchData = (text) => {
        console.log(text);
        const search_info = {
            method: "POST",
            body: JSON.stringify({
                key: text,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };

        fetch(url.flask + '/search', search_info)
            .then((response) => response.json())
            .then((response) => {

                setInfo(response.cocktail);

            });
    }

    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = (query) =>{
        setSearchQuery(query);
        searchData(query);
    }

    const renderCocktail = ({ item }) => (
        <View
        style={{alignItems:'center'}}
        >
          <TouchableOpacity  onPress={() => navigation.navigate("Detail", {
                    name:item.name,
                })}>
         
            <View style={styles.listcontainer}>
                    <ImageBackground source={{uri:item.glass || null}} 
                    >
                        <Image source={{uri:item.content || null}} 
                        style={{tintColor: item.color, width: 100, height: 80,}}
                        >
                        </Image>
                    </ImageBackground>
                <View style={{flex:1, alignItems:'flex-start'}}>
                    <Text style={{ fontWeight:'bold', fontSize: 16 }}>{item.name} </Text>
                    <Text>{item.recipe} </Text>
                </View>
            </View>
   
          </TouchableOpacity>
        </View>
        
      );

    return (
        <View style={styles.container}>
            <SearchBar
            round={true}
            lightTheme={true}
            containerStyle={{backgroundColor: 'white', borderBottomColor: 'white', paddingTop: 14}}
            inputContainerStyle = {{backgroundColor: '#e5e9f1'}}
            inputStyle={{color: 'black'}}
            placeholder="칵테일 이름이나 재료를 입력해보세요"
            onChangeText={onChangeSearch}
            value={searchQuery}
            />
            <FlatList
                data={info}
                renderItem={renderCocktail}
                keyExtractor={(item) => item.name}
            />
        </View>
    );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
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
        marginBottom: 10,
        fontSize: 20,
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
    },
    listcontainer: {
        flexDirection:'row', 
        alignItems: "center",
        backgroundColor: '#cfd3db',
        margin: 5,
        padding: 5,
        borderRadius: 10,
        width: Dimensions.get('window').width*0.96,
    },
});


