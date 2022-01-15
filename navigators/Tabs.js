import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"; 
import main from "../screens/main";
import profile from "../screens/profile";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const Tab = createBottomTabNavigator();

const Tabs = () =>{
    return(
        <Tab.Navigator>
            <Tab.Screen name="main" component={main} options={{headerShown:false,tabBarIcon:({focused,color,size})=>{
                return <Icon name="home" color={"black"} size={30} />
            },headerTitleAlign:"center"}}/>
        </Tab.Navigator>
    )
}

export default Tabs;