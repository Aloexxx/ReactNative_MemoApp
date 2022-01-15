import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"; 
import main from "../screens/main";
import profile from "../screens/profile";

const Tab = createBottomTabNavigator();

const Tabs = () =>{
    return(
        <Tab.Navigator>
            <Tab.Screen name="main" component={main} options={{headerShown:false}}/>
            <Tab.Screen name="profile" component={profile}/>
        </Tab.Navigator>
    )
}

export default Tabs;