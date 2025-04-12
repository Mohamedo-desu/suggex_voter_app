import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 5,
    elevation: 0,
    justifyContent: "center",
    height: 80,
    paddingHorizontal: 15,
    gap: 10,
  },
  groupHeader: { flex: 1, flexDirection: "row", alignItems: "center", gap: 5 },
  groupLogo: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  iconContainer: {
    position: "absolute",
    right: -3,
    top: -6,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
  },
  groupNameText: {
    fontSize: 16,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
  },
  timeText: {
    fontSize: 10,
    fontFamily: Fonts.Regular,
    color: Colors.placeholderText,
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
