import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 5,
    elevation: 2,
    padding: 15,
  },
  rejected: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  approved: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  private: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.invited,
  },
  closed: {
    opacity: 0.5,
  },
  iconContainer: {
    position: "absolute",
    right: -5,
    top: -6,
  },
  content: {},
  title: {
    fontSize: 18,
    fontFamily: Fonts.Medium,
    color: Colors.textDark,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: Colors.placeholderText,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    position: "absolute",
    top: 5,
    right: 0,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {},
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.placeholderText,
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
    fontFamily: Fonts.Medium,
    color: Colors.placeholderText,
  },
  statNumber: {
    fontSize: 12,
    fontFamily: Fonts.Medium,
    color: Colors.primary,
  },
  progressWrapper: {
    marginTop: 15,
    position: "relative",
    justifyContent: "center",
    gap: 10,
  },
  progressBarContainer: {
    height: 5,
    backgroundColor: Colors.placeholderText,
    borderRadius: 20,
    overflow: "hidden",
  },
  progressText: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.textDark,
    backgroundColor: "transparent",
    alignSelf: "flex-end",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
});
