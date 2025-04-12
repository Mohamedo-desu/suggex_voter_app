import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  listHeaderContainer: {
    backgroundColor: Colors.background,
    padding: 10,
    marginTop: 5,
  },
  groupLogo: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  imageContainer: {
    position: "relative",
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 2,
  },
});

export default styles;
