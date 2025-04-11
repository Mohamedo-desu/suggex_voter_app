import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightGray[300],
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textDark,
    paddingVertical: 10,
  },
  iconWrapper: {
    padding: 5,
  },
  pasteButton: {
    marginTop: 15,
  },
  pasteButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.Regular,
  },
  resultsContainer: {
    flex: 1,
    padding: 15,
  },
  resultHeader: {
    fontSize: 20,
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
    marginBottom: 5,
  },
  footerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  joinButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 5,
    width: "100%",
    padding: 15,
  },
  joinButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.Medium,
  },
});

export default styles;
