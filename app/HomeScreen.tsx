import React, { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker"; // Import from expo-document-picker
import { Amplify } from "aws-amplify"; // AWS Amplify for uploading
import amplifyConfig from "../amplify_outputs.json"; // Your amplify config file
import { Video, ResizeMode } from "expo-av";
import { BlurView } from "expo-blur"; // Import BlurView for blur effect
// Initialize Amplify
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";
import Tags from "./Tags";
import outputs from "../amplify_outputs.json";
import CommentSection from "./CommentSection";

Amplify.configure(outputs);

const client = generateClient<Schema>();

const canFetch = false;
const uploadies = true; // Change this to control the blur effect

const HomeScreen = ({ navigation }: any) => {
  const [videoList, setVideoList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (canFetch) {
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
    } else {
      // If canFetch is false, set an empty video list and stop loading
      setLoading(false);
      setVideoList([]);
    }
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
      <Video
        source={{
          uri:
            item.videoUrl ||
            "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        }}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.COVER}
        isLooping
        onError={(e) => console.log("Video error:", e)}
        onLoad={(e) => console.log("Video loaded:", e)}
      />
      <Text style={styles.videoTitle}>{item.title || "Untitled Video"}</Text>
      <Text style={styles.videoDetails}>
        Video ID: {item.videoId || "Missing Video Id"}
      </Text>
      <Text style={styles.videoDetails}>
        Owner ID: {item.ownerId || "Missing Owner Id"}
      </Text>
      <Text style={styles.videoDetails}>
        Video Url: {item.videoUrl || "Missing VideoUrl Id"}
      </Text>
      <Text style={styles.videoDetails}>
        Uploaded At: {item.uploadedAt || "Missing Date Id"}
      </Text>
    </View>
  );

  const emptyItem = (
    <View style={styles.videoItem}>
      <View style={styles.videoHeader}>
        <Text style={styles.dateText}>05/06/2024</Text>
        <Text style={styles.username}>Bodytree</Text>
      </View>

      <Video
        source={{
          uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        }}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.COVER}
        isLooping
        onError={(e) => console.log("Video error:", e)}
        onLoad={(e) => console.log("Video loaded:", e)}
      />
      <Text style={styles.videoTitle}>{"This is insane..."}</Text>

      <CommentSection navigation={navigation} />

      <View style={styles.tagcontainer}>
        <Tags tag={"mon"}></Tags>
        <Tags tag={"tue"}></Tags>
        <Tags tag={"wed"}></Tags>
        <Tags tag={"thu"}></Tags>
        <Tags tag={"fri"}></Tags>
        <Tags tag={"sat"}></Tags>
        <Tags tag={"sun"}></Tags>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {uploadies ? (
        <FlatList
          data={canFetch ? videoList : [null]} // If canFetch is false, pass a dummy empty item
          renderItem={canFetch ? renderVideoItem : () => emptyItem}
          keyExtractor={(item, index) => index.toString()} // Use index as key for the empty item
          contentContainerStyle={styles.list}
        />
      ) : (
        // If uploadies is false, show a blurred screen with a button
        <>
          <FlatList
            data={canFetch ? videoList : [null]} // If canFetch is false, pass a dummy empty item
            renderItem={canFetch ? renderVideoItem : () => emptyItem}
            keyExtractor={(item, index) => index.toString()} // Use index as key for the empty item
            contentContainerStyle={styles.list}
          />

          <View style={styles.blurContainer}>
            <BlurView intensity={30} style={styles.blurView}>
              <Text style={styles.blurText}>
                Post a video today to View Posts
              </Text>

              <View style={styles.uploadFeed}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate("Upload")}
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.uploadText}>Upload Video</Text>
              </View>
            </BlurView>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 80,
  },
  uploadText: {
    alignSelf: "center",
    fontSize: 40,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center", textAlign: "center"
  },
  button: {
    backgroundColor: "#000000",
    padding: 10,
    margin: 8,
    height: "60%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  uploadFeed: {
    alignContent: "center",
    backgroundColor: "#ffff",
    height: "45%",
    width: "50%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    
  },

  video: {
    width: "90%", // Adjust to fit your layout
    height: 200, // Set an appropriate height
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tagcontainer: {
    flexDirection: "row",
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject, // This ensures the blur takes up the full screen
    zIndex: 1, // Bring the blur to the front
    justifyContent: "center",
    alignItems: "center",
  },
  blurView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  blurText: {
    fontSize: 30,
    backgroundColor: "rgba(79, 146, 255, 1)",
    color: "#fff",
    marginBottom: 50,
    borderWidth: 5,
    width: "70%",
    borderColor: "rgba(20, 50, 0, 0.7)",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5, textAlign: "center"
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
    padding: 15,
    marginTop: 23,
  },
  videoItem: {
    width: 400, // Fixed width
    height: 800, // Fixed height
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderColor: "#000000",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    justifyContent: "space-between", // Space between video and text
    alignItems: "center", // Center content horizontally
    // Prevents content from overflowing
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    flexShrink: 1, // Allow text to shrink to fit
  },
  videoDetails: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  dateText: {
    fontStyle: "italic",
    fontSize: 10,
    color: "#333",
  },
  videoHeader: {
    flexDirection: "row", // Arrange items in a row
    justifyContent: "space-between", // Space between date and username
    alignItems: "center", // Vertically center items
    width: "100%", // Ensure it spans the container's full width
    paddingHorizontal: 10, // Add padding on the sides
    height: 30, // Optional: Set a consistent height for the header
  },
  username: {
    fontStyle: "italic", // Render text in italic
    alignSelf: "flex-end", // Align the text to the left
    fontSize: 16, // Adjust the size to your preference
    color: "#333", // Optional: Adjust the color
    marginBottom: 10, // Add spacing below the date
  },
});

export default HomeScreen;
