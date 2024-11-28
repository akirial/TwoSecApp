import React, { useState } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker"; // Import from expo-document-picker
//import { Amplify, Storage } from "aws-amplify"; // AWS Amplify for uploading
import amplifyConfig from "../amplify_outputs.json"; // Your amplify config file

// Initialize Amplify


const HomeScreen = ({ navigation }: any) => {
 

  

  return (
    <View style={styles.container}>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  fileUriText: {
    marginTop: 10,
    color: "gray",
  },
});

export default HomeScreen;
