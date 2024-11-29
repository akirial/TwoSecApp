import React, { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import {  FlatList,  ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker"; // Import from expo-document-picker
import { Amplify } from "aws-amplify"; // AWS Amplify for uploading
import amplifyConfig from "../amplify_outputs.json"; // Your amplify config file
import { Video, ResizeMode } from "expo-av";
// Initialize Amplify


import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource';

import outputs from '../amplify_outputs.json';
Amplify.configure(outputs);


const client = generateClient<Schema>();





const HomeScreen = ({ navigation }: any) => {
 
  const [videoList, setVideoList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
useEffect(() => {
  const fetchVideos = async () => {
    try {
      const { data, errors } = await client.models.Video.list({
        filter: {
          ownerId: {
            eq: "bodytree",
          },
        },
      });

      if (errors) {
        setError("Failed to fetch videos.");
        console.error(errors);
      } else {
        setVideoList(data); // Ensure data.items exists
      }
    } catch (err) {
      setError("An error occurred while fetching videos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchVideos();
}, []);







if (loading) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

if (error) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
}

const renderVideoItem = ({ item }: { item: any }) => (
  <View style={styles.videoItem}>
    <Text style={styles.videoTitle}>{item.title || "Untitled Video"}</Text>
    <Text style={styles.videoDetails}>Video ID: {item.videoId}</Text>
    <Text style={styles.videoDetails}>Owner ID: {item.ownerId}</Text>
    <Text style={styles.videoDetails}>Video Url: {item.videoUrl}</Text>
    <Text style={styles.videoDetails}>Video Url: {item.uploadedAt}</Text>
    

    
    <Video
  source={{ uri: "item.videoUrl" }}
  style={styles.video}
  useNativeControls
  resizeMode={ResizeMode.CONTAIN}
  isLooping
  onError={(e) => console.log('Video error:', e)}
  onLoad={(e) => console.log('Video loaded:', e)}
/>

  </View>
);

return (
  <FlatList
    data={videoList}
    renderItem={renderVideoItem}
    keyExtractor={(item) => item.videoId}
    contentContainerStyle={styles.list}
  />
);
};

const styles = StyleSheet.create({
  video: {
    width: "100%", // Adjust to fit your layout
    height: 200,   // Set an appropriate height
  },



  loading: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},
errorContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},
errorText: {
  color: "red",
  fontSize: 16,
},
list: {
  padding: 20,
},
videoItem: {
  marginBottom: 20,
  padding: 10,
  backgroundColor: "#f9f9f9",
  borderRadius: 10,
},
videoTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 5,
},
videoDetails: {
  fontSize: 14,
  color: "#555",
},
});

export default HomeScreen;