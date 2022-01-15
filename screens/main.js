import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/core";
import { useDB } from "../context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const main=()=>{
    const navigation = useNavigation();
    const realm = useDB();
    const [marked,setMarked] = useState(null);
    const [lastMarked,setLastMarked] = useState(null);
    const [list,setList] = useState();
    const [showCalendars,setShowCalendars] = useState(true);
    let dates=[];
    let current=null;

    const addMarked=async(temp)=>{
      temp.map((a)=>dates?dates.includes(a.date)?null:dates.push(a.date):dates.push(a.date)); //dates를 useState로 하면 이중 state가되어서 한턴 늦게 로딩 된다
      const obj = dates?
          dates.reduce(
            (c,v)=> Object.assign(c,{
                [v]:{marked:true,dotColor:"blue"},
              }),
              {},
          )
        :
          null
      console.log(obj,"obj")
      setMarked(()=>obj);
      setLastMarked(()=>obj);
    }

    useEffect(()=>{
      const temp = realm.objects("DayMemo")
      temp.addListener(()=>{
        setList(temp.sorted("date",false));
        addMarked(temp);
      });
      return ()=>{temp.removeAllListeners();}
    },[])

    const deletePress=()=>{
      dates=[];
      realm.write(()=>{
          realm.delete(realm.objects("DayMemo"))
        }
      )
      navigation.reset({routes:[{name:"main"}]});
    }

    return (
      <View style={{backgroundColor:"white",height:"100%"}}>
        {showCalendars?<Calendar
          current={`${new Date()}`}
          minDate={'2020-01-01'}
          maxDate={'2022-12-31'}
          onDayPress={(day)=>{
            current=day.dateString;
            setLastMarked({...marked,[current]:{selected: true, selectedColor: '#badcdc'}})
          }}
          onDayLongPress={(day) =>{
            navigation.navigate("Stacks",{
              screen:"detail",
              params:{
                day:day.dateString
              }
            })
          }}
          markedDates={lastMarked} //마킹된 날짜
          monthFormat={'yyyy MM'}
          onMonthChange={month =>{
            console.log('month changed', month);
          }}
          hideArrows={false}
          renderArrow={direction => direction==="left"?<Text>◀</Text>:<Text>▶</Text>}
          hideExtraDays={true}
          disableMonthChange={false}
          firstDay={0}
          hideDayNames={false}
          showWeekNumbers={false}
          onPressArrowLeft={subtractMonth => subtractMonth()}
          onPressArrowRight={addMonth => addMonth()}
          disableArrowLeft={false}
          disableArrowRight={false}
          disableAllTouchEventsForDisabledDays={true}
          renderHeader={date => {
              return (
                <View>
                    <Text>{date.getFullYear()}년 {date.getMonth()+1}월</Text>
                </View>
              ) 
          }}
          enableSwipeMonths={true}
        />
        :
        null
        }
        <TouchableOpacity onPress={()=>setShowCalendars((prev)=>!prev)} style={{alignItems:"center"}}>
          {showCalendars?<Icon name={"chevron-up"} size={20} color="black"/>:<Icon name={"chevron-down"} size={20} color="black"/>}
        </TouchableOpacity>
        <FlatList
          data={list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <TouchableOpacity onPress={()=>deletePress()} style={{padding:5,margin:5,alignItems:"center",width:"20%",left:"79%"}}>
              <Text style={{color:"red",fontSize:12}}>전체삭제</Text>
            </TouchableOpacity>
          }
          renderItem={({item})=>(
            <TouchableOpacity onPress={() =>navigation.navigate("Stacks",{
                screen:"detail",
                params:{
                  day:item.date
                }
              })} style={{borderWidth:0.2,borderColor:"black",padding:5,margin:5,borderRadius:5}}>
              <Text style={{color:"blue",opacity:0.5}}>{item.date}</Text>
              <Text style={{fontSize:22}}>{item.text}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
}

export default main;