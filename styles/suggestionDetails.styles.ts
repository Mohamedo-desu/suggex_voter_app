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
    fontSize: 12,
    color: Colors.textDark,
    fontFamily: Fonts.Medium,
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
    fontSize: 12,
    fontFamily: Fonts.Regular,
    paddingVertical: 10,
  },
});

export default styles;
