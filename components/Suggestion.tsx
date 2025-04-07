import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Suggestion = ({ item }) => {
  const rejected = item.status === "rejected";
  const approved = item.status === "approved";

  return (
    <View
      style={{
        backgroundColor: Colors.background,
        borderRadius: 10,
        elevation: 2,
        padding: 15,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          color: Colors.textDark,
          fontFamily: Fonts.Medium,
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{ fontSize: 14, color: Colors.placeholderText }}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {item.description}
      </Text>
    </View>
  );
};

export default Suggestion;

const styles = StyleSheet.create({});
