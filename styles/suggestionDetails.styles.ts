import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  contentContainer: {
    gap: 10,
    paddingBottom: 40,
  },
  resultHeader: {
    fontSize: 12,
    color: Colors.textDark,
    fontFamily: Fonts.Medium,
    marginTop: 10,
    marginHorizontal: 15,
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: Colors.textDark,
    fontSize: 16,
    fontFamily: Fonts.Bold,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: Colors.textDark,
    marginBottom: 8,
    fontSize: 12,
    fontFamily: Fonts.Regular,
  },

  pickerContainer: {
    overflow: "hidden",
    backgroundColor: Colors.cardBackground,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "web" ? 15 : 0,
  },
  invitationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default styles;
