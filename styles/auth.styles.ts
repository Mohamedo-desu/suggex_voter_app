import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { Dimensions, Platform, StyleSheet } from "react-native";
const { height, width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  brandSection: {
    alignItems: "center",
    marginTop: height * 0.12,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "rgba(74, 222, 128, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    fontSize: 35,
    fontFamily: Fonts.Bold,
    color: Colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: Colors.placeholderText,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  illustration: {
    width: Platform.OS === "web" ? width * 0.7 : width * 0.55,
    height: Platform.OS === "web" ? width * 0.7 : width * 0.55,
    maxHeight: 300,
    maxWidth: 300,
  },
  loginSection: {
    width: "100%",
    paddingHorizontal: 24,
    alignItems: "center",
  },
});
