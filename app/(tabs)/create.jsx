import { View,Text,Image, StyleSheet, Platform, FlatList, Button, TextInput, SafeAreaView, Pressable } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../context/themeContext';
import { convertToTimeFormat } from '../../util/time';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

export default function create(){
    const [minute,setMinute] = useState(0);
    const [second,setSecond] = useState(0);
    const [timeName, setTimeName] = useState('');
    const [timeListName, setTimeListName] = useState('');
    const [timeList,setTimeList] = useState([]);
    const [timeListMain, setTimeListMain]= useState([]);
    const {theme, colorScheme} = useContext(ThemeContext);
    const styles = stylesMain(theme,colorScheme);
    const router = useRouter();

    useEffect(()=>{
        fetchData = async()=>{
            const jsonValue = await AsyncStorage.getItem('TimeList');
            const toPut = jsonValue != null ? JSON.parse(jsonValue) : [];
            setTimeListMain(toPut);
        }

        fetchData();
    },[]);

    useEffect(()=>{
    
        const storeData = async()=>{
            try {
                const jsonVal = JSON.stringify(timeListMain);
                await AsyncStorage.setItem('TimeList', jsonVal);
            } catch (error) {
                console.error(error);
                
            }
        }

        storeData()        
    },[timeListMain])

    const createTime = async () =>{
        const toPut = [
            ...timeListMain,
            {
            id : timeListMain.length +1,
            name : timeName,
            timeList : timeList
            }
        ]
        setTimeListMain(toPut)
        router.push('/')
    }
    const createTimeList = () =>{
        const toPut = {
            id : timeList.length + 1,
            name : timeListName,
            time : (minute*60)+second
        }

    
        setTimeList([...timeList, toPut])
        
    }
    
    const removeTimeList = (id) =>{
        setTimeList(timeList.filter(item => item.id != id))
    }


    const renderTimeList = ({item}) => {
        return (
            <View style={styles.eachTimeListContainer}>
                <Text style={styles.EachTimeListTime}>{convertToTimeFormat(item.time)}</Text>
                <Text style={styles.EachTimeListName}>{item.name}</Text>
                <Pressable onPress={()=>removeTimeList(item.id)} style={styles.removeTimeListBtn}>
                <Entypo name="trash" size={24} color="black" />
                </Pressable>
            
            </View>
        )
    }



    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.nameHeadContainer}>
                <TextInput
                    style={styles.nameTimeInput}
                    value={timeName}
                    onChangeText={setTimeName}
                    placeholder='Set Name of This Timer'
                />
                <Pressable style={styles.timeAddBtn} onPress={()=>createTime()}>
                    <Text style={styles.commonText}>Add</Text>
                </Pressable>
            </View>
            <View style={styles.addTimeListContainer}>
                <TextInput
                    style={styles.timeListName}
                    onChangeText={setTimeListName}
                    placeholder='get text'
                    value={timeListName}/>
                <View style={styles.timerContainerMain}>
                    <View style={styles.timerContainer}>
                        <Pressable style={styles.plusBtn} onPress={()=>setMinute(minute+1)}>
                            <Text style={styles.commonText}>
                                +
                            </Text>
                        </Pressable>
                        <Text style={styles.addTimeNumber}>{minute}</Text>
                        <Pressable style={styles.minusBtn} onPress={()=>setMinute(minute-1)}>
                            <Text style={styles.commonText}>
                                -
                            </Text>
                        </Pressable>
                    </View>
                    <View style={styles.timerContainer}>
                        <Pressable style={styles.plusBtn} onPress={()=>setSecond(second+1)}>
                            <Text style={styles.commonText}>
                                +
                            </Text>
                        </Pressable>
                        <Text style={styles.addTimeNumber}>{second}</Text>
                        <Pressable style={styles.minusBtn} onPress={()=>setSecond(second-1)}>
                            <Text style={styles.commonText}>
                                -
                            </Text>
                        </Pressable>
                    </View>
                </View>                
                <Pressable style={styles.timeListAddBtn} onPress={()=>createTimeList()}>
                    <Text style={styles.commonText}>Add</Text>
                </Pressable>
            </View>
            <FlatList
                data={timeList}
                renderItem={renderTimeList}
                keyExtractor={item=> item.id}
                contentContainerStyle={{marginTop:20}}
            />
            

        </SafeAreaView>
    )    
}

const stylesMain = (theme,colorScheme)=>{
    return StyleSheet.create({
        container : {
            flex:1,
            backgroundColor: theme.background,
        },
        nameHeadContainer : {
            flexDirection: 'row',
            marginBottom:10,
            alignItems: 'center',
            width: '100%',
            maxWidth: 1024,
            justifyContent: 'center',
            padding:10,
            gap:20,
            paddingTop:40,

        },
        addTimeListContainer: {
            gap:20,
            flexDirection:'column',
            alignItems: 'center',
            justifyContent: 'center',
            height:350

        },
        timerContainerMain:{
            flex:1,
            alignContent: 'center',
            justifyContent: 'center',
            flexDirection:'row',
            gap: 20
        },
        timerContainer: {
            flex:1,
            alignItems: 'center',
            justifyContent:'center',
            flexDirection:'column',
            width: 120,
            height: 200,
            marginHorizontal: 5
        },
        nameTimeInput:{
            fontSize: 20,
            borderWidth:2,
            borderRadius:20,
            padding: 5,
            borderColor:theme.normalText,
            color: theme.normalText
        },
        
        timeAddBtn:{
            fontSize:20,
            backgroundColor: theme.btnBackground,
            color:theme.textOfButton,
            padding: 5,
            borderRadius:10
        },
        plusBtn:{
            textAlign:'center',
            backgroundColor: theme.btnBackground,
            color: theme.textOfButton,
            fontSize:30,
            paddingHorizontal:25,
            width: 70,         
            height: 30,  
        
        },
        minusBtn:{
            textAlign:'center',
            backgroundColor: theme.btnBackground,
            color: theme.textOfButton,
            fontSize:30,
            paddingHorizontal:25,
            width: 70,         
            height: 30,    

        },
        timeListName:{
            fontSize:20,
            borderWidth:2,
            borderRadius:20,
            padding: 5,
            width:300,
            borderColor:theme.normalText,
            color: theme.normalText
        },
        addTimeNumber:{
            fontSize:70,
            width:'100%',
            textAlign:'center',
            color:theme.normalText
        },
        removeTimeListBtn: {
            padding: 5,
            flexShrink: 0, 
            marginLeft: 'auto', 
            width: 40, 
            height: 40, 
            justifyContent: 'center',
            alignItems: 'center',
        },
        timeListAddBtn:{
            fontSize:20,
            backgroundColor: theme.btnBackground,
            color: theme.textOfButton,
            paddingVertical: 10,
            paddingHorizontal: 30,
            borderRadius:10
        },
        EachTimeListName:{
            color: theme.textOfButton,
            marginLeft:10,
            fontSize:20,
            color:theme.normalText
        },
        EachTimeListTime:{
            color: theme.normalText,
            fontSize:30,
            
        },
        eachTimeListContainer:{
            borderTopWidth:1,
            flex:1,
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            padding:5,
            borderColor: theme.backgroundColor
        },
        commonText :{
            color: theme.textOfButton,
            fontSize: 20
        }

    })
}