import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView, Button, StyleSheet, Text } from "react-native";
import { Authenticator } from "@aws-amplify/ui-react-native"; // Optional: for Amplify authentication

import HomeScreen from "./app/HomeScreen";
import LoginScreen from "./app/LoginScreen";
import Feed from "./app/Feed";
import { Amplify } from "aws-amplify";
import outputs from "./amplify_outputs.json";
import Calender from "./app/Calender";
import LocalVideoTrimmer from "./app/LocalVideoTrimmer";
import CommentVideo from "./app/CommentVideo";
import SignInScreen from "./app/SignInScreen";
import MyProfile from "./app/MyProfile";

Amplify.configure(outputs);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Initialize Amplify with the configuration from the amplify_outputs.json
    } catch (error) {
      console.error("Error configuring Amplify:", error);
      setConfigError("Amplify configuration failed.");
    }
  }, []);

  if (configError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: "red" }}>{configError}</Text>
      </SafeAreaView>
    );
  }

  // Create Bottom Tabs Navigation
  const TabNavigator = () => {
    return (
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Upload" component={Feed} options={{ headerShown: false }} />
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Calender" component={Calender} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={MyProfile} options={{ headerShown: false }} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Authenticator.Provider>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false, presentation: 'modal'  }} />
          <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false,  presentation: 'modal' } } />
          <Stack.Screen name="Feed" component={Feed} options={{ headerShown: false }} />
          <Stack.Screen name="Calender" component={Calender} options={{ headerShown: false }} />
          <Stack.Screen name="CommentVideo" component={CommentVideo} options={{ headerShown: false }} />
          <Stack.Screen name="LocalVideoTrimmer" component={LocalVideoTrimmer} options={{ headerShown: false }} />
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
