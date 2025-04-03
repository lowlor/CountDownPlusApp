import { View,Text,Image, StyleSheet, Platform, FlatList, Pressable } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../context/themeContext';
import Feather from '@expo/vector-icons/Feather';
import {data} from '../../data/time'
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function mainPage(){
    const [timeData , setTimeData] = useState([]);
    const {theme, colorScheme} = useContext(ThemeContext)
    const router = useRouter()
    
    useEffect(()=>{
        const fetchData = async()=>{
            const dataToPut = await AsyncStorage.getItem('TimeList');
            const toPut = dataToPut != null ? JSON.parse(dataToPut) : [];
            console.log(toPut);
            
            setTimeData(toPut);
        }

        fetchData()
    },[])

    useEffect(()=>{
        const updateData = async() =>{
            try {
                await AsyncStorage.setItem('TimeList', JSON.stringify(timeData))                        
            } catch (error) {
                console.error(error);
                
            }

        }
        updateData();
    },[timeData])

    const styles = stylesBack(theme,colorScheme);

    const removeItem = (id)=>{
        const filteredData = timeData.filter(item=> item.id != id);
        setTimeData(filteredData);
    }


    const render = ({item}) =>{
        return (
            <Pressable onPress={()=>router.push(`/timer/${item.id}`)}>
                <View style={styles.itemContainer} >
                    <Text style={styles.text}>{item.name}</Text>
                    <Feather name="trash-2" size={30} color={colorScheme === 'dark' ? 'white' : 'black'} onPress={()=>removeItem(item.id)}/>
                </View>

            </Pressable>
        )
    }
    console.log(timeData);
    
    return(
        <SafeAreaView style={styles.container}>
            {timeData.length > 0 ?
            (
                <>
                    <View style={styles.toolBarContainer}>
                        <Pressable style={styles.createBtn} onPress={()=>router.push('/create')}>
                            <Text style={{fontSize: 20, color:'black'}}>Add</Text>
                        </Pressable>
                    </View>
                    <FlatList
                        data={timeData}
                        renderItem={render}
                        contentContainerStyle={{gap:10, marginTop: 10}}
                        keyExtractor={item=>item.id}
                    />
                
                </>
            ) 
            : 
            (
                <View style={styles.emptyContainer} onPress={()=>router.push('/create')}>
                    <Text style={styles.text} onPress={()=>router.push('/create')}>Press Anywhere to Create</Text>
                </View>
            )}
        </SafeAreaView>
    )
}

const stylesBack = (theme,colorScheme)=>{
    return StyleSheet.create({
        container:{
            flex:1,
            width:'100%',
            height:'100%',
            backgroundColor: theme.background
        }, 
        text :{
            fontSize: 30,
            color: theme.text
        },
        emptyContainer:{
            justifyContent: 'center',
            alignItems:'center',
            width:'100%',
            height:'100%'
        },
        itemContainer:{
            flex:1,
            flexDirection:'row',
            justifyContent:'space-between',
            backgroundColor: theme.itemBackground,
            borderRadius: 20,
            padding: 10,
            gap:10,
            marginHorizontal: 10
        },
        toolBarContainer:{
            padding: 10,
            flexDirection:'row',
            alignItems:'center',
            justifyContent: 'flex-end',
            backgroundColor: 'black'
        },
        createBtn:{
            padding:5,
            backgroundColor:'white',
            borderRadius:10
        },
        
       
        
    })
}






