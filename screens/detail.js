import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useEffect } from "react/cjs/react.development";
import { useDB } from "../context";

const detail =({route:{params:{day}}})=>{
    const navigation = useNavigation();
    const realm = useDB();
    const [temp,setTemp] = useState(null);
    const [text,setText] = useState(null);

    useEffect(()=>{
        navigation.setOptions({
            title:`${day}`
        })
    },[])

    useEffect(()=>{
        setTemp(realm.objects("DayMemo").filtered(`date="${day}"`)) 
        setText(realm.objects("DayMemo").filtered(`date="${day}"`)[0]?.text)
        console.log(temp,"temp")
        temp?console.log(temp[0]):null
    },[realm])

    const onSave=()=>{
        if(text===""){
            return Alert.alert("Please complete form.");
        }
        temp[0]? 
            realm.write(()=>{
                realm.create("DayMemo",{
                    id:temp[0].id,
                    text,
                },true);
            })
        :
            realm.write(()=>{
                realm.create("DayMemo",{
                    id:Date.now(),
                    date:day,
                    text,
                });
            });
        navigation.goBack();
    }

    const onDelete = ()=>{
        realm.write(()=>{
            realm.delete(realm.objects("DayMemo").filtered(`date="${day}"`))
        })
        navigation.reset({routes:[{name:"main"}]});
        navigation.goBack();
    }

    return (
        <View style={{alignItems:"center",justifyContent:"center",width:"100%",height:"100%"}}>  
            <View style={{height:"80%",width:"80%",borderRadius:10,borderWidth:0.2,marginBottom:5}}>
                <TextInput placeholder="내용 입력" value={text} onChangeText={setText} multiline/>
            </View>
            <TouchableOpacity onPress={onSave} style={{borderWidth:1,borderColor:"black",borderRadius:10,padding:5,margin:5,alignItems:"center",width:"80%"}}>
                <Text>저장</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={{borderWidth:1,borderColor:"black",borderRadius:10,padding:5,margin:5,alignItems:"center",width:"80%"}}>
                <Text style={{color:"red"}}>삭제</Text>
            </TouchableOpacity>
        </View>
    )
}

export default detail;