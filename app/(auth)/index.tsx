import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "@/constants/colors";
import * as Linking from "expo-linking";

const Login = () => {
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const redirectUrl = Linking.createURL("/");

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("OAuth error", error);
    }
  };
  return (
    <View style={styles.container}>
      {/* BRAND SECTION */}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.appName}>Suggex-Voter</Text>
        <Text style={styles.tagline}>Your Vote,Your Power</Text>
      </View>
      {/* ILLUSTRATION */}
      <View style={styles.illustrationContainer}></View>
      {/* LOGIN SECTION*/}
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.8}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={Colors.surface} />
          </View>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
