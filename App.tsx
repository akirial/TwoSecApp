import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, Button, StyleSheet } from "react-native";
import { Authenticator } from "@aws-amplify/ui-react-native"; // Optional: for Amplify authentication

import HomeScreen from "./app/HomeScreen";
import LoginScreen from "./app/LoginScreen";
import Feed from "./app/Feed";




import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json';

Amplify.configure(outputs);



// Create the Stack and Bottom Tabs Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Create Bottom Tabs Navigation
const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Home" component={HomeScreen} />
      
      
      <Tab.Screen name="Profile" component={LoginScreen} />
      
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Authenticator.Provider>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={TabNavigator} />
          
          
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Feed" component={Feed} />
        </Stack.Navigator>
      </Authenticator.Provider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
