import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
//import { Storage } from 'aws-amplify'; // For Amplify Gen 2
import { uploadData } from 'aws-amplify/storage';
// Utility to convert URI to Blob
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

function Feed() {
  const [image, setImage] = useState<string | null>(null); // Store image URI

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
      const response = await uploadData({
        path: `photos/${filename}`,
        data: blob,
    })

      Alert.alert('Success', `Image uploaded successfully! Key: ${response.key}`);
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
