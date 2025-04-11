import Colors from "@/constants/colors";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Loader = ({ size = "small" }: { size?: "small" | "large" }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Colors.primary} />
      <StatusBar style="light" backgroundColor={Colors.background} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
