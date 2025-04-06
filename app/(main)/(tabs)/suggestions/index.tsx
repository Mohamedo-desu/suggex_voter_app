import Colors from "@/constants/colors";
import { useAuth } from "@clerk/clerk-expo";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SuggestionsScreen = () => {
  const { signOut } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => signOut()}
        style={{
          backgroundColor: Colors.primary,
          marginVertical: 20,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          width: "50%",
        }}
      >
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuggestionsScreen;

const styles = StyleSheet.create({});
