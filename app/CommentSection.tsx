import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the RootStackParamList to type navigation routes

const CommentSection = ({ navigation }: any) => {
  
  
  
  
//   console.log("This is navigation state ",navigation.getState());

  const handlePress = () => {
    // navigation.navigate("CommentVideo"); // Ensure route name matches navigator
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <View>
          <Text style={styles.text}>
            Jake1234:{" "}
            <Text style={styles.comment}>
              This was insane man i love everything you do i mean the rabbit
              main was insane
            </Text>
          </Text>
        </View>
        <View>
          <Text style={styles.text}>
            Cassandra: <Text style={styles.comment}>So Cute</Text>
          </Text>
        </View>
        <View>
          <Text style={styles.text}>
            Jake1234:{" "}
            <Text style={styles.comment}>
              This was insane man i love everything you do i mean the rabbit
              main was insane
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    marginTop: 6,
  },
  comment: {
    fontWeight: "500",
  },
  container: {
    width: "80%",
    height: "20%",
  },
});

export default CommentSection;
