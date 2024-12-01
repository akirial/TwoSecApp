import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from 'expo-router';

const CommentVideo = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Comment Detail</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
        <Text style={{ color: "blue" }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommentVideo;
