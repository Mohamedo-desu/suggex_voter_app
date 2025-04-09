import Colors from "@/constants/colors";
import * as Application from "expo-application";
import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PrivacyTerms = () => {
  const openPrivacyPolicy = () => {
    const url =
      "https://www.termsfeed.com/live/b9b83488-3035-4933-af3e-8cc8e964e4b4";
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open Privacy Policy URL:", err)
    );
  };

  return (
    <View style={[styles.footer]}>
      <Text style={[styles.versionCodeText, { color: Colors.placeholderText }]}>
        v{Application.nativeApplicationVersion}
      </Text>

      <Text>By using, you agree to our</Text>
      <TouchableOpacity
        hitSlop={10}
        activeOpacity={0.8}
        style={styles.footerTextContainer}
        onPress={openPrivacyPolicy}
      >
        <Text style={styles.footerText}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrivacyTerms;

const styles = StyleSheet.create({
  footer: {
    alignSelf: "center",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginBottom: 10,
  },
  footerTextContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    flexWrap: "wrap",
  },
  footerText: {
    textDecorationLine: "underline",
    fontSize: 10,
    color: Colors.primary,
  },
  versionCodeText: {
    textAlign: "center",
    marginBottom: 15,
  },
});
