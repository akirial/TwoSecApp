import React, { useState } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker"; // For Expo
import { Amplify, Storage } from "@aws-amplify/core"; // Correct imports
import amplifyConfig from "../amplify_outputs.json"; // Your amplify config file

// Configure AWS Amplify with the information from amplify_outputs.json
Amplify.configure({
  auth: {
    user_pool_id: amplifyConfig.auth.user_pool_id, // User Pool ID from your config
    user_pool_client_id: amplifyConfig.auth.user_pool_client_id, // User Pool Client ID from your config
    identity_pool_id: amplifyConfig.auth.identity_pool_id, // Identity Pool ID from your config
    aws_region: amplifyConfig.auth.aws_region, // AWS region from your config
    mandatorySignIn: false, // Adjust based on your app's auth flow
    authenticationFlowType: "USER_SRP_AUTH", // Default authentication flow for Cognito User Pools
    standardAttributes: {
      email: true, // Mark email as a required standard attribute
    },
    usernameAttributes: ["email"], // User login attribute (email in this case)
    mfaMethods: [], // No MFA enabled, adjust if needed
  },
  storage: {
    bucket: amplifyConfig.storage.bucketName, // Bucket name from your config
    region: amplifyConfig.storage.region, // Region from your config
    identityPoolId: amplifyConfig.auth.identity_pool_id, // Identity pool ID from your config
  },
});

const HomeScreen = ({ navigation }: any) => {
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Function to select a video file from device storage
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*", // Filter for video files
        copyToCacheDirectory: false,
      });

      if (result.type === "success") {
        setFileUri(result.uri);
      }
    } catch (error) {
      console.error("File selection error: ", error);
    }
  };

  // Function to upload the video to AWS S3 using uploadData
  const uploadFile = async () => {
    if (!fileUri) return;

    setUploading(true);
    setUploadProgress(0);

    // Create a unique key for the file to avoid overwriting files
    const fileName = fileUri.split("/").pop();
    const key = `videos/${Date.now()}_${fileName}`;

    // Create the file object with the necessary data
    const file = {
      uri: fileUri,
      name: fileName,
      type: "video/*", // Replace with actual video type
    };

    try {
      // Upload the file using uploadData
      const result = await Storage.uploadData(key, file, {
        progressCallback: (progress) => {
          const progressPercentage = Math.round(
            (progress.loaded / progress.total) * 100
          );
          setUploadProgress(progressPercentage);
        },
      });

      console.log("File uploaded successfully: ", result);
    } catch (error) {
      console.error("Upload error: ", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
      
      <View style={styles.uploadContainer}>
        <Button title="Pick a Video" onPress={pickFile} />
        {fileUri && (
          <Text style={styles.fileUriText}>Selected File: {fileUri}</Text>
        )}
        {uploading ? (
          <Text>Uploading... {uploadProgress}%</Text>
        ) : (
          <Button title="Upload Video" onPress={uploadFile} />
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
