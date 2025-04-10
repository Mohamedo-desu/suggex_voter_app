import Colors from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Empty = ({ text }: { text: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { color: Colors.placeholderText, fontSize: 13 },
});
