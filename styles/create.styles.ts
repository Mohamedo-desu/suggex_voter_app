import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    gap: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  keyboardContainer: { flex: 1 },
  modalContent: {
    gap: 10,
    padding: 20,
  },
  pickerContainer: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.border,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  scrollContainer: { flexGrow: 1 },
  sectionTitle: {
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default styles;
