import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, Button, StyleSheet, Text } from "react-native";
import { Authenticator } from "@aws-amplify/ui-react-native"; // Optional: for Amplify authentication

import HomeScreen from "./app/HomeScreen";
import LoginScreen from "./app/LoginScreen";
import Feed from "./app/Feed";

import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json';


Amplify.configure(outputs);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Initialize Amplify with the configuration from the amplify_outputs.json
      

      // Optionally, check if the configuration is working by checking the user
      
    } catch (error) {
      console.error('Error configuring Amplify:', error);
      setConfigError('Amplify configuration failed.');
    }
  }, []); // Empty dependency array means this runs once when the component mounts

  // If there is a configuration error, show it in the UI
  if (configError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'red' }}>{configError}</Text>
      </SafeAreaView>
    );
  }

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
