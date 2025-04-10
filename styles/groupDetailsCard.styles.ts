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
  leftHeader: {},
  groupNameText: {
    fontSize: 22,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    position: "absolute",
    top: 0,
    right: 0,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    // Customize as needed
  },
  groupStatusText: {
    fontSize: 16,
    fontFamily: Fonts.Medium,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
    color: Colors.placeholderText,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: Fonts.Regular,
    color: Colors.textDark,
  },
  copyButton: {
    marginLeft: 10,
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
    fontSize: 14,
    fontFamily: Fonts.Medium,
    color: Colors.placeholderText,
  },
  statNumber: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
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
    fontSize: 18,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: Colors.textDark,
    marginBottom: 8,
    fontSize: 14,
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
    borderRadius: 10,
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
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
