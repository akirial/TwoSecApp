import React, { useState } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker"; // For Expo
import { Amplify } from "aws-amplify"; // Correct import for Amplify
import { Storage } from "@aws-amplify/storage"; // Correct import for Storage
import amplifyConfig from '../amplify_outputs.json'; // Your amplify config file

// Configure AWS Amplify with the information from amplify_outputs.json
Amplify.configure({
  auth: {
    identity_pool_id: amplifyConfig.auth.identity_pool_id,
    aws_region: amplifyConfig.auth.aws_region,
    user_pool_id: amplifyConfig.auth.user_pool_id,
    user_pool_client_id: amplifyConfig.auth.user_pool_client_id,
  },
  Storage: {
    AWSS3: {
      bucket: amplifyConfig.Storage.bucket,
      region: amplifyConfig.Storage.region,
    },
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
        type: "*/*", // You can filter to only videos by using mime types like "video/*"
        copyToCacheDirectory: false,
      });

      if (result.type === "success") {
        setFileUri(result.uri);
      }
    } catch (error) {
      console.error("File selection error: ", error);
    }
  };

  // Function to upload the video to AWS S3
  const uploadFile = async () => {
    if (!fileUri) return;

    setUploading(true);
    setUploadProgress(0);

    // Create a unique key for the file to avoid overwriting files
    const fileName = fileUri.split("/").pop();
    const key = `videos/${Date.now()}_${fileName}`;

    const file = {
      uri: fileUri,
      name: fileName,
      type: "video/*", // Replace with actual video type
    };

    try {
      const uploadResult = await Storage.put(key, file, {
        progressCallback: (progress) => {
          const progressPercentage = Math.round(
            (progress.loaded / progress.total) * 100
          );
          setUploadProgress(progressPercentage);
        },
      });

      console.log("File uploaded successfully: ", uploadResult);
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
