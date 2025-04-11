import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: 10,
    marginTop: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  groupStatusText: {
    fontSize: 12,
    fontFamily: Fonts.Medium,
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {},
  description: {
    fontSize: 12,
    fontFamily: Fonts.Medium,
    color: Colors.textDark,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
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
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.placeholderText,
    marginRight: 4,
  },
  statNumber: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.primary,
  },
  progressWrapper: {
    marginTop: 15,
  },
  progressBar: {
    height: 5,
    backgroundColor: Colors.lightGray[200],
    borderRadius: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
  progressFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  progressText: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.textDark,
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
