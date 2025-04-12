import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  contentContainer: {
    gap: 10,
    paddingBottom: 40,
  },
  listHeader: {},
  resultHeader: {
    fontSize: 14,
    color: Colors.textDark,
    fontFamily: Fonts.Medium,
    padding: 0,
    marginTop: 10,
    marginHorizontal: 15,
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
    fontSize: 12,
    fontFamily: Fonts.Regular,
  },
  input: {
    backgroundColor: Colors.lightGray[200],
    borderRadius: 8,
    padding: 12,
    color: Colors.textDark,
    fontSize: 16,
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
    marginBottom: 8,
  },
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 1000,
    elevation: 10,
    paddingHorizontal: 15,
    gap: 10,
  },
  groupLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  groupNameText: {
    fontSize: 12,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
  },
  groupStatusText: {
    fontSize: 12,
    fontFamily: Fonts.Medium,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.placeholderText,
  },
  statNumber: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.primary,
  },
});
