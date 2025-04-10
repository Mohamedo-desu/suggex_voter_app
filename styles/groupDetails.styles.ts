import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  contentContainer: {
    padding: 15,
    gap: 10,
  },

  resultHeader: {
    fontSize: 16,
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
  },
});
