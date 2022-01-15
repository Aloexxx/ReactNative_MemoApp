import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import detail from "../screens/detail";

const NativeStack = createNativeStackNavigator();

const Tabs = () =>{
    return(
        <NativeStack.Navigator>
            <NativeStack.Screen name="detail" component={detail}/>
        </NativeStack.Navigator>
    )
}

export default Tabs;