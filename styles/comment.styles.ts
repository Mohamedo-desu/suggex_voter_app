import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  commentContainer: {
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 5,
  },
  commentAuthor: {
    fontSize: 10,
    fontFamily: Fonts.Regular,
    color: Colors.primary,
    marginBottom: 5,
  },
  commentText: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.textDark,
  },
  header: { flexDirection: "row", alignItems: "center" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
