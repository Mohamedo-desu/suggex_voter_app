import InitialLayout from "@/components/InitialLayout";
import Colors from "@/constants/colors";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { LogBox, Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys"]);

const _layout = () => {
  // UPDATE NATIVE NAVIGATION BAR ON ANDROID
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(Colors.background);
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={Colors.background} />
    </ClerkAndConvexProvider>
  );
};

export default _layout;
