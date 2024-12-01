import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, Text } from "react-native";
import { Amplify } from "aws-amplify";
import outputs from "./amplify_outputs.json";

import HomeScreen from "./app/HomeScreen";
import Feed from "./app/Feed";
import Calender from "./app/Calender";
import LoginScreen from "./app/LoginScreen";
import CommentVideo from "./app/CommentVideo";
import LocalVideoTrimmer from "./app/LocalVideoTrimmer";

// Set up Amplify configuration
Amplify.configure(outputs);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Additional logic for config setup if necessary
    } catch (error) {
      console.error("Error configuring Amplify:", error);
      setConfigError("Amplify configuration failed.");
    }
  }, []);

  // If there is a configuration error, show it in the UI
  if (configError) {
    return (
      <SafeAreaView>
        <Text>{configError}</Text>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      {/* Wrap the navigation structure in the container */}
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Feed"
          component={Feed}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Calender"
          component={Calender}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CommentVideo"
          component={CommentVideo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocalVideoTrimmer"
          component={LocalVideoTrimmer}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// TabNavigator for managing bottom tabs
const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Upload" component={Feed} options={{ headerShown: false }}/>
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Calender" component={Calender} options={{ headerShown: false }}/>
      <Tab.Screen name="Profile" component={LoginScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default App;
