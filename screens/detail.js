import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity } from "react-native";
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
        <>
            <TextInput placeholder="내용 입력" value={text} onChangeText={setText}/>
            <TouchableOpacity onPress={onSave} style={{borderWidth:1,borderColor:"black",padding:5,margin:5,alignItems:"center"}}>
                <Text>저장</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={{borderWidth:1,borderColor:"black",padding:5,margin:5,alignItems:"center"}}>
                <Text>삭제</Text>
            </TouchableOpacity>
        </>
    )
}

export default detail;