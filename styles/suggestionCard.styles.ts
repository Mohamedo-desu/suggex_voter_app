import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 10,
  },
  rejected: {
    backgroundColor: Colors.error,
    padding: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  approved: {
    backgroundColor: Colors.primary,
    padding: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  private: {
    backgroundColor: Colors.invited,
    padding: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  open: {
    backgroundColor: Colors.primary,
    padding: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  closed: {
    backgroundColor: Colors.error,
    padding: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    right: -5,
    top: -6,
  },
  content: {},
  title: {
    fontSize: 14,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.placeholderText,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  editButton: {},
  deleteButton: {},
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 10,
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
    fontFamily: Fonts.Regular,
    color: Colors.placeholderText,
  },
  statNumber: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
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
    backgroundColor: Colors.lightGray[200],
    borderRadius: 20,
    overflow: "hidden",
  },
  progressText: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.textDark,
    alignSelf: "flex-end",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
});
