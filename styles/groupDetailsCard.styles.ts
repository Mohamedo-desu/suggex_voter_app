import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  listHeaderContainer: {
    backgroundColor: Colors.background,
    padding: 10,
    marginTop: 5,
  },
  headerContainer: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  leftHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupNameText: {
    fontSize: 16,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 15,
  },
  editButton: {},
  deleteButton: {},
  groupStatusText: {
    fontSize: 12,
    fontFamily: Fonts.Medium,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.placeholderText,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.textDark,
  },
  copyButton: {
    marginLeft: 15,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
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
});

export default styles;
