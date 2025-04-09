import Colors from "@/constants/colors";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

const MainLayout = () => {
  const { user } = useUser();

  if (!user) return <Redirect href={"/(auth)"} />;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          title: "Create Suggestion",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          title: "Manage Settings",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="groupDetails"
        options={{
          title: "Inside Box",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="suggestionDetails"
        options={{
          title: "Inside Suggestion",
          headerTitleAlign: "center",
          headerRight: (props) => (
            <TouchableOpacity
              activeOpacity={0.8}
              hitSlop={10}
              onPress={() => undefined}
              {...props}
            >
              <Ionicons name="share-outline" size={25} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default MainLayout;
