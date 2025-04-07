import Colors from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Empty = ({ text }: { text: string }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: Colors.placeholderText, fontSize: 13 }}>
        {text}
      </Text>
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({});
