import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native';

const TabsLayout = () => {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.placeholderText,
        tabBarStyle: styles.tabBarStyle,
        tabBarButton: props => <Pressable {...props} android_ripple={null} />,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ size, color }) => <Ionicons name="home" size={size} color={color} />,
          tabBarLabel: 'Home',
          title: 'Suggestion Box',
          headerTitleAlign: 'center',
          headerRight: props => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              activeOpacity={0.8}
              hitSlop={10}
              onPress={() => router.push('/create')}
              {...props}
            >
              <Ionicons name="add-circle-outline" size={25} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ size, color }) => <Ionicons name="search" size={size} color={color} />,
          tabBarLabel: 'Search',
          title: 'Search',
          headerTitleAlign: 'center',
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: Colors.background,
    paddingBottom: 8,
  },
});
