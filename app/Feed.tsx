import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, Alert, TextInput, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadData } from 'aws-amplify/storage';
import { v4 as uuidv4 } from 'uuid';
import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

import type { Schema } from '../amplify/data/resource';

Amplify.configure(outputs);
const client = generateClient<Schema>();

const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

function Feed({ navigation }) {
  const [cvideo, setVideo] = useState<string | null>(null);
  const [amtLoaded, setamtLoaded] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [ownerId, setOwnerId] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handlePickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your media library to upload a video.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled) {
        setVideo(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error picking video:', err);
      Alert.alert('Error', 'An error occurred while selecting the video.');
    }
  };

  const handleVideoUpload = async () => {
    if (!cvideo) {
      Alert.alert('Error', 'Please select a video first.');
      return;
    }
    if (!title || !description || !ownerId) {
      Alert.alert('Error', 'Please fill in all fields (Title, Description, Owner ID).');
      return;
    }

    try {
      setIsUploading(true); // Start uploading
      const blob = await uriToBlob(cvideo);
      const filename = `video-${Date.now()}.mp4`;

      const result = await uploadData({
        path: `video-submissions/${filename}`,
        data: blob,
        options: {
          onProgress: (progress) => {
            const { transferredBytes, totalBytes } = progress;
            if (totalBytes) {
              setamtLoaded(
                `Upload progress ${Math.round((transferredBytes / totalBytes) * 100)}%`
              );
            }
          },
        },
      }).result;

      console.log('Upload succeeded:', result);

      // Creating the video entry
      const videoUrl = `https://twosecawasbucketappforme.s3.us-east-2.amazonaws.com/video-submissions/${filename}`;
      const { errors, data: newVideo } = await client.models.Video.create({
        videoId: uuidv4(),
        title,
        description,
        videoUrl,
        ownerId,
      });

      if (errors) {
        console.error('API Errors during video creation:', errors);
        Alert.alert('Error', 'There was an issue creating the video entry.');
        return;
      }

      console.log('Video entry created successfully:', newVideo);
      Alert.alert('Success', 'Video entry created successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert('Error', 'An error occurred during video upload.');
    } finally {
      setIsUploading(false); // Stop uploading
      setamtLoaded(null); // Reset progress
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Your Video</Text>
      <Button title="Select Video" onPress={handlePickVideo} />
      {cvideo && <Text style={styles.fileName}>Video Selected</Text>}

      <TextInput
        style={styles.input}
        placeholder="Enter Video Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Video Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Owner ID"
        value={ownerId}
        onChangeText={setOwnerId}
      />

      {isUploading ? (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.uploadingText}>Uploading...</Text>
          {amtLoaded && <Text>{amtLoaded}</Text>}
        </View>
      ) : (
        <Button title="Upload Video" onPress={handleVideoUpload} disabled={!cvideo} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  fileName: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 10,
    textAlign: 'center',
  },
  uploadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  uploadingText: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default Feed;
