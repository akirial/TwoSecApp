import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { signIn, confirmSignIn } from "aws-amplify/auth";
 // Make sure this is imported correctly
 import { useNavigation } from '@react-navigation/native';
const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState(""); // For OTP or MFA code
  const [error, setError] = useState(""); 
  const [nextStep, setNextStep] = useState<any>(null); // Correct typing for nextStep
  const navigation = useNavigation();




  const handleSignIn = async () => {
    try {
      const { nextStep } = await signIn({ username: email, password });
      setNextStep(nextStep); // Set the nextStep state with the response from signIn
    } catch (err) {
      setError("Error during sign-in: " + err.message);
    }
  };

  const handleConfirmSignIn = async () => {
    try {
      // Collect the challenge response from the user (OTP, MFA response, etc.)
      await confirmSignIn({
        challengeResponse: confirmationCode,
      });

      Alert.alert("Success", "You are now signed in!");
      // Proceed to the main app screen after successful sign-in.
    } catch (err) {
      setError("Error during confirmation: " + err.message);
    }
  };

  const renderSignInForm = () => (
    <View style={styles.form}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );

  const renderConfirmationForm = () => (
    <View style={styles.form}>
      <TextInput
        placeholder="Confirmation Code"
        value={confirmationCode}
        onChangeText={setConfirmationCode}
        style={styles.input}
      />
      <Button title="Confirm Sign In" onPress={handleConfirmSignIn} />
    </View>
  );

  return (
    <View style={styles.container}>
  <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>



      <Text style={styles.title}>Sign In</Text>
      
      {nextStep ? renderConfirmationForm() : renderSignInForm()}
      <TouchableOpacity style={styles.have} onPress={() => {navigation.navigate('LoginScreen')}}><Text>Dont Have An Account? Sign Up!</Text></TouchableOpacity>


      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },


  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: 'black',
  },


  have: {

    marginTop: 20
    
    
    
      },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default SignInScreen;
