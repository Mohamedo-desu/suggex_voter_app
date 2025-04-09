import Colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const TabsLayout = () => {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.placeholderText,
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          title: "Suggestion Box",
          headerTitleAlign: "center",
          headerRight: (props) => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              activeOpacity={0.8}
              hitSlop={10}
              onPress={() => router.navigate("/create")}
              {...props}
            >
              <Ionicons
                name="add-circle-outline"
                size={25}
                color={Colors.primary}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
          title: "Search Suggestion Or Group",
          headerTitleAlign: "center",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: Colors.background,
    borderTopWidth: 0,
    position: "absolute",
    elevation: 0,
    height: 40,
    paddingBottom: 8,
  },
});
