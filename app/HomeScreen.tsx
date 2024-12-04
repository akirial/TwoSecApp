import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Video, ResizeMode } from "expo-av";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";
import outputs from "../amplify_outputs.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // Icon for refresh button

Amplify.configure(outputs);

const client = generateClient<Schema>();

const HomeScreen = ({ navigation }: any) => {
  const [videoList, setVideoList] = useState<any[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const { data, errors } = await client.models.Video.list();
      if (errors) {
        setError("Failed to fetch videos.");
        console.error(errors);
      } else {
        setVideoList(data);
        setFilteredVideos(data); // Initialize filtered videos
        setError(null); // Clear any previous errors
      }
    } catch (err) {
      setError("An error occurred while fetching videos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (text === "") {
      setFilteredVideos(videoList); // Reset filter if search is cleared
    } else {
      const filtered = videoList.filter(
        (video) =>
          video.ownerId &&
          video.ownerId.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
  };

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
        shouldPlay={true}
        onError={(e) => console.log("Video error:", e)}
        onLoad={(e) => console.log("Video loaded:", e)}
      />
      <Text style={styles.videoTitle}>{item.title || "Untitled Video"}</Text>
      <Text style={styles.videoDetails}>
        Uploaded At: {item.uploadedAt || "Missing Date"}
      </Text>
      <Text style={styles.videoDetails}>
        Owner ID: {item.ownerId || "Missing Owner ID"}
      </Text>
      <Text style={styles.videoDetails}>
        Video Desc: {item.description || "No Description"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by Owner ID..."
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchVideos}
          accessible
          accessibilityLabel="Refresh videos"
        >
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredVideos}
        renderItem={renderVideoItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No videos found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
  },
  searchBar: {
    flex: 1,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  refreshButton: {
    marginLeft: 10,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
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
    padding: 10,
    paddingBottom: 50, // Add bottom padding for the last item
  },
  videoItem: {
    marginBottom: 20, // Add spacing between items
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  video: {
    width: "100%",
    height: 500,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
    textAlign: "center",
  },
  videoDetails: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
  },
});

export default HomeScreen;
