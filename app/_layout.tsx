import InitialLayout from "@/components/InitialLayout";
import Colors from "@/constants/colors";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
  LogBox,
  Platform,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

LogBox.ignoreLogs(["Clerk: Clerk has been loaded with development keys."]);

const RootLayout: React.FC = () => {
  const { width } = useWindowDimensions();
  const isWeb: boolean = Platform.OS === "web";

  // Update Android navigation bar
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(Colors.background);
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  // Elevation style for web using boxShadow
  const webElevation: Partial<ViewStyle> = isWeb
    ? { boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)", borderRadius: 12 }
    : {};

  // Dynamic style based on screen width and platform
  const getContentStyle = (): ViewStyle => {
    if (!isWeb) return styles.content;

    if (width < 640) {
      // Phone: No margins
      return { ...styles.content, ...styles.phone, ...webElevation };
    } else if (width < 1024) {
      // Tablet: Add horizontal and vertical margins
      return { ...styles.content, ...styles.tablet, ...webElevation };
    } else {
      // Desktop: Center content and add margins for readability
      return { ...styles.content, ...styles.desktop, ...webElevation };
    }
  };

  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, getContentStyle()]}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={Colors.background} />
    </ClerkAndConvexProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  phone: {
    paddingHorizontal: 0,
    marginVertical: 0,
  },
  tablet: {
    paddingHorizontal: 32,
    marginVertical: 16,
  },
  desktop: {
    alignSelf: "center",
    width: "80%",
    maxWidth: 1000,
    marginVertical: 20,
  },
});
