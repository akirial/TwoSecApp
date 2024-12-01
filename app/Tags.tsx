import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";

const Tags = ({ tag }) => {
  const renderTag = () => {
    switch (tag) {
      case "mon":
        return (
          <View style={[styles.container, styles.mon]}>
            <Text style={styles.text}>Mon</Text>
          </View>
        );
      case "tue":
        return (
          <View style={[styles.container, styles.tue]}>
            <Text style={styles.text}>Tue</Text>
          </View>
        );
      case "wed":
        return (
          <View style={[styles.container, styles.wed]}>
            <Text style={styles.text}>Wed</Text>
          </View>
        );
      case "thu":
        return (
          <View style={[styles.container, styles.thu]}>
            <Text style={styles.text}>Thu</Text>
          </View>
        );
      case "fri":
        return (
          <View style={[styles.container, styles.fri]}>
            <Text style={styles.text}>Fri</Text>
          </View>
        );
      case "sat":
        return (
          <View style={[styles.container, styles.sat]}>
            <Text style={styles.text}>Sat</Text>
          </View>
        );
      case "sun":
        return (
          <View style={[styles.container, styles.sun]}>
            <Text style={styles.text}>Sun</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.container, styles.default]}>
            <Text style={styles.text}>Unknown</Text>
          </View>
        );
    }
  };

  return renderTag();
};

export default Tags;

const styles = StyleSheet.create({
  container: {
    padding: 6,
    marginTop: 1,
    margin: 2,
    borderWidth: 1,
    height: 30,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    borderColor: "rgba(20, 50, 0, 0.7)",
  },
  text: {
    fontSize: 13,
    color: "#000",
  },
  mon: {
    backgroundColor: "rgba(255, 0, 0, 0.3)", // Red
  },
  tue: {
    backgroundColor: "rgba(0, 255, 0, 0.3)", // Green
  },
  wed: {
    backgroundColor: "rgba(0, 0, 255, 0.3)", // Blue
  },
  thu: {
    backgroundColor: "rgba(255, 255, 0, 0.3)", // Yellow
  },
  fri: {
    backgroundColor: "rgba(255, 0, 255, 0.3)", // Magenta
  },
  sat: {
    backgroundColor: "rgba(0, 255, 255, 0.3)", // Cyan
  },
  sun: {
    backgroundColor: "rgba(255, 165, 0, 0.3)", // Orange
  },
  default: {
    backgroundColor: "rgba(128, 128, 128, 0.3)", // Gray for unknown
  },
});
