import { Platform, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

export const styles = StyleSheet.create({
  contentContainer: {
    gap: 10,
    paddingBottom: 40,
  },
  groupLogo: {
    height: 100,
    width: '100%',
  },
  groupNameText: {
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
    fontSize: 12,
  },
  groupStatusText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    marginHorizontal: 10,
    width: 60,
  },
  imagePickerContainer: {
    alignItems: 'center',
    padding: 16,
  },
  imagePickerOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  imagePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.lightGray[200],
    borderRadius: 8,
    color: Colors.textDark,
    fontSize: 16,
    padding: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: Colors.textDark,
    fontFamily: Fonts.Regular,
    fontSize: 12,
  },
  invitationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  listHeader: {},
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    padding: 15,
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
    fontSize: 14,
    marginHorizontal: 10,
    marginTop: 10,
    padding: 0,
  },
  statItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statLabel: {
    color: Colors.placeholderText,
    fontFamily: Fonts.Regular,
    fontSize: 12,
    marginRight: 4,
  },
  statNumber: {
    color: Colors.primary,
    fontFamily: Fonts.Regular,
    fontSize: 12,
  },
  statsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  stickyHeader: {
    alignItems: 'flex-start',
    backgroundColor: Colors.background,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1.5,
    elevation: 10,
    gap: 10,
    justifyContent: 'center',
    left: 0,
    paddingBottom: 5,
    paddingHorizontal: 15,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000,
  },
});
