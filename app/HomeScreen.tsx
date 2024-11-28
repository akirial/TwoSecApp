import React, { useState } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker"; // Import from expo-document-picker
//import { Amplify, Storage } from "aws-amplify"; // AWS Amplify for uploading
import amplifyConfig from "../amplify_outputs.json"; // Your amplify config file

// Initialize Amplify


const HomeScreen = ({ navigation }: any) => {
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />

      <View style={styles.uploadContainer}>
        <Button title="Pick a File"  />
        {fileUri && <Text style={styles.fileUriText}>Selected File: {fileUri}</Text>}
        {uploading ? (
          <Text>Uploading... {uploadProgress}%</Text>
        ) : (
          <Button title="Upload File"  />
        )}
      </View>
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
