import { Platform, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

const styles = StyleSheet.create({
  actionButton: {},
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  container: {
    backgroundColor: Colors.background,
    marginTop: 5,
    padding: 10,
  },
  copyButton: {
    marginLeft: 10,
  },
  description: {
    color: Colors.textDark,
    fontFamily: Fonts.Medium,
    fontSize: 12,
    marginBottom: 8,
  },
  detailLabel: {
    color: Colors.placeholderText,
    fontFamily: Fonts.Regular,
    fontSize: 12,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailValue: {
    color: Colors.textDark,
    fontFamily: Fonts.Regular,
    fontSize: 12,
  },
  groupStatusText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  progressBar: {
    backgroundColor: Colors.lightGray[200],
    borderRadius: 20,
    height: 5,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: Colors.primary,
    height: '100%',
  },
  progressFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  progressText: {
    color: Colors.textDark,
    fontFamily: Fonts.Regular,
    fontSize: 12,
  },
  progressWrapper: {
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 15,
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
    marginTop: 8,
  },
  title: {
    color: Colors.textDark,
    flex: 1,
    fontFamily: Fonts.Bold,
    fontSize: 16,
  },
});

export default styles;
