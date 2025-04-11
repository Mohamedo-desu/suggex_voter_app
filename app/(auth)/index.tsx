import CustomButton from "@/components/CustomButton";
import PrivacyTerms from "@/components/PrivacyTerms";
import Colors from "@/constants/colors";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/clerk-expo";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

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
        router.replace("/(main)/(tabs)");
      }
    } catch (error) {
      console.log("OAuth error", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <FontAwesome5 name="box-open" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.appName}>Suggestion Box</Text>
        <Text style={styles.tagline}>Suggest, Vote, Improve — Together</Text>
      </View>

      <View style={styles.illustrationContainer}>
        <Image
          source={require("@/assets/images/auth-bg.png")}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      <View style={styles.loginSection}>
        <CustomButton
          text="Sign in with Google"
          onPress={handleGoogleSignIn}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </View>
      <PrivacyTerms />
    </View>
  );
};

export default Login;
