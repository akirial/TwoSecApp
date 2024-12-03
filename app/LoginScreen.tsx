import React, { useState } from "react";
import { Button, View, TextInput, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Amplify } from "aws-amplify";
import { signUp, confirmSignUp, autoSignIn } from 'aws-amplify/auth';
import outputs from "../amplify_outputs.json";
import { useNavigation } from '@react-navigation/native';

Amplify.configure(outputs);

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [step, setStep] = useState('signUp'); // 'signUp' or 'confirmSignUp' or 'done'
  const [error, setError] = useState('');
  const navigation = useNavigation();

  // Sign up method
  const handleSignUp = async () => {
    try {
      const { nextStep: signUpNextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email, // You can use phone_number instead if using phone for sign-up
          }
        }
      });

      if (signUpNextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setStep('confirmSignUp');
        console.log("Code delivery Destination", signUpNextStep.codeDeliveryDetails.destination);
        console.log("Code Delivery Medium:", signUpNextStep.codeDeliveryDetails.deliveryMedium);
      } else {
        setStep('done');
        console.log("SignUp complete");
      }
    } catch (err) {
      setError(err.message || "Error during sign up");
    }
  };

  // Confirm sign-up method
  const handleConfirmSignUp = async () => {
    try {
      const { nextStep } = await confirmSignUp({
        username: email, 
        confirmationCode
      });

      if (nextStep.signUpStep === 'DONE') {
        setStep('done');
        console.log("SignUp Confirmed");
      } else if (nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
        // If auto sign-in is enabled, sign in automatically
        const { nextStep: signInNextStep } = await autoSignIn();
        if (signInNextStep.signInStep === 'DONE') {
          console.log("Successfully signed in.");
        }
      }
    } catch (err) {
      setError(err.message || "Error during confirmation");
    }
  };

  // Render Sign-Up form
  const renderSignUpForm = () => (
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
      <Button title="Sign Up" onPress={handleSignUp} />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  // Render Confirm Sign-Up form
  const renderConfirmSignUpForm = () => (
    <View style={styles.form}>
      <TextInput
        placeholder="Confirmation Code"
        value={confirmationCode}
        onChangeText={setConfirmationCode}
        style={styles.input}
      />
      <Button title="Confirm Sign Up" onPress={handleConfirmSignUp} />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Sign Up!!!!</Text>
      {step === 'signUp' && renderSignUpForm()}
      {step === 'confirmSignUp' && renderConfirmSignUpForm()}
      <TouchableOpacity style={styles.have} onPress={() => {navigation.navigate('SignInScreen')}}><Text>Have An Account? Sign In!</Text></TouchableOpacity>
      {step === 'done' && <Text>Sign-up is complete! You are now signed in.</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    marginTop: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;
