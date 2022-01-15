import React, { useEffect, useState } from 'react';
import {NavigationContainer} from "@react-navigation/native";
import Root from "./navigators/Root";
import Realm from 'realm';
import { DBContext } from './context';
import { Text } from 'react-native';

const DayMemoSchema = {
  name:"DayMemo",
  properties:{
    id:"int",
    date:"string",
    text:"string",
  },
  primaryKey:"id",
}

const App=() =>{
  const [realm,setRealm] = useState(null);

  const startLoading = async ()=>{
    await Realm.open({
      path:"junbeombDayDB",
      schema:[DayMemoSchema],
      schemaVersion:2, //version2:2022-01-14
      migration:function(oldRealm,newRealm){
        if (oldRealm.schemaVersion < 2) {
          var oldObjects = oldRealm.objects('DayMemo');
          var newObjects = newRealm.objects('DayMemo');
          console.log(oldObjects)
          for (var i = 0; i < oldObjects.length; i++) {
            newObjects[i].id = oldObjects[i]._id;
          }
        }
      }
    }).then(a=>setRealm(a));
  };
  useEffect(()=>{
    startLoading();
  },[])

  return (
    realm?
      <DBContext.Provider value={realm}>
        <NavigationContainer>
          <Root/>
        </NavigationContainer>
      </DBContext.Provider>
   :
      <Text>Loading...</Text>
  );
};


export default App;
