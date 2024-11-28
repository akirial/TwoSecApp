import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
//import { Storage } from 'aws-amplify'; // For Amplify Gen 2
import { uploadData } from 'aws-amplify/storage';
// Utility to convert URI to Blob
import { v4 as uuidv4 } from 'uuid';




import { generateClient } from 'aws-amplify/data';
import type {Schema } from '../amplify/data/resource'




import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);



const client = generateClient<Schema>();





const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

function Feed() {
  const [image, setImage] = useState<string | null>(null); // Store image URI
  const [cvideo, setVideo] = useState<string | null>(null); // Store image URI


  const handlePickVideo = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your media library to upload a video.');
        return;
      }
  
      // Open video picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Restrict to videos
        allowsEditing: false, // You can choose whether to allow editing (cropping, trimming)
        quality: 1, // Maximum quality
      });
  
      if (!result.canceled) {
        console.log('Selected video URI:', result.assets[0].uri); // Store selected video URI
        setVideo(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error picking video:', err);
      Alert.alert('Error', 'An error occurred while selecting the video.');
    }
  };



  const handlePickImage = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your photo library to upload an image.');
        return;
      }

      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to images
        allowsEditing: true, // Allow basic image editing (cropping)
        quality: 1, // Maximum quality
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri); // Store selected image URI
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'An error occurred while selecting the image.');
    }
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    try {
      const blob = await uriToBlob(image); // Convert the URI to a blob
      const filename = `image-${Date.now()}.jpg`; // Generate a unique filename

      // Upload to Amplify storage
      try {
        const result = await uploadData({
          path: `picture-submissions/${filename}`,
          // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
          data: blob,
        }).result;
        console.log('Succeeded: ', result);
        Alert.alert("File Uplodaed Succesfully");
      } catch (error) {
        console.log('Error : ', error);
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'An error occurred during image upload.');
    }
  };

  const handleVideoUpload = async () => {
    if (!cvideo) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    try {
      const blob = await uriToBlob(cvideo); // Convert the URI to a blob
      const filename = `video-${Date.now()}.mp4`; // Generate a unique filename

      // Upload to Amplify storage
      try {

    // 



        const result = await uploadData({
          path: `video-submissions/${filename}`,
          // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
          data: blob,
        }).result;
        console.log('Succeeded: ', result);
        Alert.alert("File Uplodaed Succesfully");



        
        try {
          // Attempt to create a new video entry
          const { errors, data: newVideo } = await client.models.Video.create({
            videoId: uuidv4(),
            title: "No Title",
            description: "No Description",
            videoUrl: `s3://amplify-twosecapp-eleva-s-amplifyteamdrivebucket28-fpzgdu4hit7l/video-submissions/${filename}`,
            ownerId: "bodytree",
          });
        
          // Check for API-specific errors
          if (errors) {
            console.error("API Errors during video creation:", errors);
            Alert.alert("Error", "There was an issue creating the video entry.");
            return; // Exit if errors were returned
          }
        
          console.log("Video entry created successfully:", newVideo);
          Alert.alert("Success", "Video entry created successfully!");
        } catch (error) {
          // Catch unexpected runtime errors
          console.error("Unexpected error during video creation:", error);
          Alert.alert("Error", "An unexpected error occurred.");
        }
        

           






      } catch (error) {
        console.log('Error : ', error);
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'An error occurred during image upload.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select Image" onPress={handlePickImage} />
      {image && (
        <>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <Text style={styles.fileName}>Image Selected</Text>
        </>
      )}
      <Button title="Upload" onPress={handleUpload} disabled={!image} />

      <Button title="Select Video" onPress={handlePickVideo} />
      {cvideo && (
        <>
          
          <Text style={styles.fileName}>Video Selected</Text>
        </>
      )}
      <Button title="Upload Video" onPress={handleVideoUpload} disabled={!cvideo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  fileName: {
    marginVertical: 10,
    fontSize: 16,
    color: 'gray',
  },
});

export default Feed;
