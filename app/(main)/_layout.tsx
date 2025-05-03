import { useUser } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

const MainLayout = () => {
  const { user } = useUser();

  if (!user) return <Redirect href={'/(auth)'} />;

  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          title: 'Create Suggestion',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="groupDetails"
        options={{
          title: 'Group Details',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="suggestionDetails"
        options={{
          title: 'Suggestion Details',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="editGroup"
        options={{
          title: 'Edit Group',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="editSuggestion"
        options={{
          title: 'Edit Suggestion',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
};

export default MainLayout;
