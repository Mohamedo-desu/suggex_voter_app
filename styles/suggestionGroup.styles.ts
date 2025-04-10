import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 5,
    elevation: 2,
    justifyContent: "center",
    height: 80,
    paddingHorizontal: 15,
    borderBottomWidth: 3,
    gap: 10,
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
  },
  groupNameText: {
    fontSize: 20,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.placeholderText,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statItemContainer: {
    flex: 1,
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
});
