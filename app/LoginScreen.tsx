import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native"; // Import AWS Amplify Authenticator

// Define the types for the navigation prop
interface Props {
  navigation: any;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signOut, user } = useAuthenticator(); // Getting signOut and user from Authenticator

  return (
    <View style={styles.container}>
      <Authenticator>
        {/* This block will be rendered if the user is authenticated */}
        {({ signOut, user }) => (
          user ? (
            <View>
              <Text>Welcome, {user.username}!</Text>
              <Button title="Sign Out" onPress={signOut} />
            </View>
          ) : (
            // If the user is not authenticated, show the login screen
            <View>
              <Text>Login Screen</Text>
              <Button title="Go to Home" onPress={() => navigation.goBack()} />
            </View>
          )
        )}
      </Authenticator>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
