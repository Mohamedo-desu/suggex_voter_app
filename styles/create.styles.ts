import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    overflow: "hidden",
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  modalContent: {
    padding: 20,
    gap: 10,
  },
});

export default styles;
