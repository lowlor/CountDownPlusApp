import { View,Text,Image, StyleSheet, Platform, FlatList, Button, TextInput, SafeAreaView, Pressable } from 'react-native';
import { useContext, useEffect, useState, useRef } from 'react';
import { ThemeContext } from '../../../context/themeContext';
import { convertToTimeFormat } from '../../../util/time';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';


export default function timer(){
    const {id} = useLocalSearchParams();
    const [minute,setMinute] = useState(0);
    const [second,setSecond] = useState(0);
    const [timeList,setTimeList] = useState([{time: 0}]);
    const [timeListMain, setTimeListMain]= useState([]);
    const [currentTimeList, setCurrentTimeList] = useState([]);
    const [currentTimeListIndex, setCurrentTimeListIndex] = useState(0);
    const [timeEnd , setTimeEnd] = useState(false);
    const [isStopped, setIsStopped] = useState(true);
    const {theme, colorScheme} = useContext(ThemeContext);
    const intervalRef = useRef(null);
    const styles = stylesMain(theme,colorScheme);
    const router = useRouter();

    useEffect(()=>{
        fetchData = async()=>{
            console.log(id);
            
            const jsonValue = await AsyncStorage.getItem('TimeList');
            const toPut = jsonValue != null ? JSON.parse(jsonValue) : [];
            let thisTime = toPut.filter(item => item.id === parseInt(id));
            thisTime = thisTime[0];
            console.log(thisTime);
            
            setTimeListMain(thisTime);
            setTimeList(thisTime.timeList) 
            setCurrentTimeList(thisTime.timeList[0])
            setMinute(Math.floor(thisTime.timeList[0].time/60));
            setSecond(thisTime.timeList[0].time%60);
            
        }

        fetchData();
    },[id]);

    useEffect(()=>{
        console.log('dedededede');
        
        console.log(timeList);
        
        setMinute(Math.floor(timeList[currentTimeListIndex].time/60));
        setSecond(timeList[currentTimeListIndex].time%60)
    },[currentTimeListIndex])



    const setTimer = (time) =>{
        console.log(time);
        
        let timeToSet = time;
        
        if(intervalRef.current){
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            timeToSet--;
            
            setMinute(Math.floor((timeToSet) / 60));
            setSecond(timeToSet % 60);
            
            
            if(timeToSet<=0){
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setIsStopped(true);
                if(timeList.length != currentTimeListIndex+1){
                    setCurrentTimeListIndex(currentTimeListIndex+1)
                }
            }
        }, 1000);
        
    }

    
    

    const handleClickTimeList = (id)=>{
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsStopped(true);
        setCurrentTimeListIndex(id-1);

    }

    const handlePlayPause = ()=>{
        if(isStopped){
            setTimer((minute*60)+second)
            setIsStopped(false)
        }else{
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsStopped(true)
        }
    }

    const handleForward = ()=>{
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsStopped(true);
        setCurrentTimeListIndex(currentTimeListIndex+1);
    }

    const handleBackward = ()=>{
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsStopped(true);
        setCurrentTimeListIndex(currentTimeListIndex-1);
    }

    const handleReset = ()=>{
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsStopped(true);
        setCurrentTimeListIndex(0);
    }
    
    const renderTimeList = ({item}) => {
        return (
            <Pressable onPress={()=>handleClickTimeList(item.id)}>
                <View style={[styles.eachTimeListContainer, item.id === currentTimeListIndex+1 ? styles.currentTimeList : null]}>
                    <Text style={styles.EachTimeListTime}>{convertToTimeFormat(item.time)}</Text>
                    <Text style={styles.EachTimeListName}>{item.name}</Text>
                </View>
            </Pressable>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.nameHeadContainer}>
             
                <Text style={styles.nameTimeInput}>{timeListMain.name}</Text>
               
            </View>
            <View style={styles.addTimeListContainer}>
                <Text style={styles.timeListName}>{timeList[currentTimeListIndex].name}</Text>
                <View style={styles.timerContainerMain}>
                    <View style={styles.timerContainer}>
                        
                        <Text style={styles.addTimeNumber}>{minute}</Text>
                        
                    </View>
                    <View style={styles.timerContainer}>
                        
                        <Text style={styles.addTimeNumber}>{second}</Text>
                        
                    </View>
                </View>  
                <View style={styles.timeControllerContainer}>
                    {currentTimeListIndex === 0 ? <></> 
                    : (
                    <Pressable style={styles.timeListAddBtn} onPress={()=>handleBackward()}>
                        <AntDesign name="banckward" size={24} color={colorScheme === 'dark' ? 'black': 'white'} />
                    </Pressable>)
                    }              
                    <Pressable style={styles.timeListAddBtn} onPress={()=>handlePlayPause()}>
                        { isStopped 
                        ? <FontAwesome name="play" size={24} color={colorScheme === 'dark' ? 'black': 'white'} /> 
                         : <FontAwesome name="pause" size={24} color={colorScheme === 'dark' ? 'black': 'white'} />}
                    </Pressable>
                    {currentTimeListIndex+1 != timeList.length ? 
                    (
                        <Pressable style={styles.timeListAddBtn} onPress={()=>handleForward()}>
                            <AntDesign name="forward" size={24} color={colorScheme === 'dark' ? 'black': 'white'} />
                        </Pressable>
                    ): <></>}
                    <Pressable style={styles.timeListAddBtn} onPress={()=>handleReset()}>
                        <FontAwesome5 name="square-full" size={24} color={colorScheme === 'dark' ? 'black': 'white'} />    
                    </Pressable>

                </View>

                
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
            paddingTop:30,
            gap:20

        },
        addTimeListContainer: {
            gap:20,
            flexDirection:'column',
            alignItems: 'center',
            justifyContent: 'center',
            height:200

        },
        timerContainerMain:{
            flex:1,
            alignContent: 'center',
            justifyContent: 'center',
            flexDirection:'row',
            gap: 20,
            width:'100%',
            height:100
        },
        timerContainer: {
            flex:1,
            alignItems: 'center',
            justifyContent:'center',
            flexDirection:'column',
            width:'100%',
            height:100,
            textAlign:'center'
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
        
        },
        minusBtn:{
            textAlign:'center',
            backgroundColor: theme.btnBackground,
            color: theme.textOfButton,
            fontSize:30,
            paddingHorizontal:25,
        },
        timeListName:{
            fontSize:20,
            borderWidth:2,
            borderRadius:20,
            padding: 5,
            borderColor:theme.normalText,
            color: theme.normalText
        },
        addTimeNumber:{
            fontSize:70,
            color:theme.normalText
        },
        timeListAddBtn:{
            fontSize:20,
            backgroundColor: theme.btnBackground,
            color: theme.textOfButton,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius:50
        },
        EachTimeListName:{
            color: theme.normalText,
            fontSize:20
        },
        EachTimeListTime:{
            color: theme.normalText,
            fontSize:30
        },
        eachTimeListContainer:{
            borderTopWidth:1,
            flex:1,
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            padding:5
        },
        commonText :{
            color: theme.textOfButton,
            fontSize: 20
        },
        currentTimeList :{
            backgroundColor: '#5d6d7e'
        },
        timeControllerContainer:{
            flexDirection: 'row',
            gap:10
        }
    })
}