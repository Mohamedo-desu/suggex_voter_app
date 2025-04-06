import Colors from "@/constants/colors";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const Loader = ({ size = "large" }: { size?: "small" | "large" }) => {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: Colors.background,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <ActivityIndicator size={size} color={Colors.primary} />
      <StatusBar style="light" backgroundColor={Colors.background} />
    </View>
  );
};

export default Loader;
