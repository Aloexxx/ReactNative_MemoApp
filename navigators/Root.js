import React from "react";
import Tabs from "./Tabs";
import Stacks from "./Stacks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Nav = createNativeStackNavigator();

const Root = ()=>(
    <Nav.Navigator screenOptions={{headerShown:false}}>
        <Nav.Screen name="Tabs" component={Tabs}/>
        <Nav.Screen name="Stacks" component={Stacks}/>
    </Nav.Navigator>
)

export default Root;