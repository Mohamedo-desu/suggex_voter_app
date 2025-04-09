import InitialLayout from "@/components/InitialLayout";
import Colors from "@/constants/colors";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import * as Sentry from "@sentry/react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigationContainerRef } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
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

SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

const manifest = Updates.manifest;
const metadata = "metadata" in manifest ? manifest.metadata : undefined;
const extra = "extra" in manifest ? manifest.extra : undefined;
const updateGroup =
  metadata && "updateGroup" in metadata ? metadata.updateGroup : undefined;

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllText: false,
      maskAllImages: false,
      maskAllVectors: false,
    }),
    Sentry.spotlightIntegration(),
    navigationIntegration,
  ],
  _experiments: {
    profilesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  },
  debug: false,
  enableAutoSessionTracking: true,
  attachScreenshot: true,
  attachStacktrace: true,
  enableAutoPerformanceTracing: true,
});

const scope = Sentry.getGlobalScope();

scope.setTag("expo-update-id", Updates.updateId);
scope.setTag("expo-is-embedded-update", Updates.isEmbeddedLaunch);

if (typeof updateGroup === "string") {
  scope.setTag("expo-update-group-id", updateGroup);

  const owner = extra?.expoClient?.owner ?? "[account]";
  const slug = extra?.expoClient?.slug ?? "[project]";
  scope.setTag(
    "expo-update-debug-url",
    `https://expo.dev/accounts/${owner}/projects/${slug}/updates/${updateGroup}`
  );
} else if (Updates.isEmbeddedLaunch) {
  // This will be `true` if the update is the one embedded in the build, and not one downloaded from the updates server.
  scope.setTag("expo-update-debug-url", "not applicable for embedded updates");
}

const RootLayout: React.FC = () => {
  const { width } = useWindowDimensions();
  const isWeb: boolean = Platform.OS === "web";

  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(Colors.background);
      NavigationBar.setButtonStyleAsync("light");
    }
  }, [ref]);

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

export default Sentry.wrap(RootLayout);

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
