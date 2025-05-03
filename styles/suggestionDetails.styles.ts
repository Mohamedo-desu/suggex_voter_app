import { Platform, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: Colors.background,
    gap: 10,
    marginTop: 5,
    padding: 10,
    zIndex: -1,
  },
  commentInput: {
    color: Colors.textDark,
    fontFamily: Fonts.Regular,
    fontSize: 12,
    paddingVertical: 10,
  },
  contentContainer: {
    gap: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: Colors.textDark,
    fontFamily: Fonts.Regular,
    fontSize: 12,
    marginBottom: 8,
  },
  invitationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
    fontSize: 16,
  },

  pickerContainer: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.border,
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'web' ? 15 : 0,
  },
  resultHeader: {
    color: Colors.textDark,
    fontFamily: Fonts.Medium,
    fontSize: 12,
    marginHorizontal: 15,
    marginTop: 10,
  },
});

export default styles;
