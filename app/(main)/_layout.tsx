import { Stack } from "expo-router";
import React from "react";

const MainLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="create" />
    </Stack>
  );
};

export default MainLayout;
