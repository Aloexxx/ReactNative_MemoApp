import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/core";
import { useDB } from "../context";

const main=()=>{
    const navigation = useNavigation();
    const realm = useDB();
    const [marked,setMarked] = useState(null);
    const [lastMarked,setLastMarked] = useState(null);
    const [list,setList] = useState();
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
      return(
        realm.write(()=>{
            realm.delete(realm.objects("DayMemo"))
          }
        )
      )
    }

    return (
      <>
        <Calendar
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
                    <Text>{date.getMonth()+1}</Text>
                </View>
              ) 
          }}
          enableSwipeMonths={true}
        />
        <TouchableOpacity onPress={()=>deletePress()} style={{padding:5,margin:5,borderWidth:1,borderColor:"black",alignItems:"center",borderRadius:10}}>
          <Text>모두삭제</Text>
        </TouchableOpacity>
        <FlatList
          data={list}
          renderItem={({item})=>(
            <TouchableOpacity onPress={() =>navigation.navigate("Stacks",{
                screen:"detail",
                params:{
                  day:item.date
                }
              })} style={{borderWidth:1,borderColor:"black",padding:5,margin:5,borderRadius:10}}>
              <Text>{item.date}</Text>
              <Text>{item.text}</Text>
            </TouchableOpacity>
          )}
        />
      </>
    )
}

export default main;