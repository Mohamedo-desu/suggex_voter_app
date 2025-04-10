import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  contentContainer: {
    padding: 15,
    gap: 10,
    paddingBottom: 40,
  },
  resultHeader: {
    fontSize: 16,
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
  },
  commentContainer: {
    backgroundColor: Colors.background,
    marginTop: 5,
    padding: 10,
    gap: 10,
    zIndex: -1,
  },
  commentInput: {
    color: Colors.textDark,
    fontSize: 14,
    fontFamily: Fonts.Regular,
    paddingVertical: 10,
  },
  commentButton: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  commentButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
});

export default styles;
