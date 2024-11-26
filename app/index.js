import React from "react";
import { Button, View, SafeAreaView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";

import outputs from "./amplify_outputs.json";

Amplify.configure(outputs);

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.signOutButton}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

const HomeScreen = () => {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/login");  // Navigate to login screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Go to Login" onPress={goToLogin} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signOutButton: {
    alignSelf: "flex-end",
  },
});

export default HomeScreen;
