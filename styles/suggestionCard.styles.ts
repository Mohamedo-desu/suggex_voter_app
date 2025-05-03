import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

export const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  approved: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    padding: 5,
  },
  closed: {
    alignItems: 'center',
    backgroundColor: Colors.error,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    padding: 5,
  },
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 10,
  },
  content: {},
  deleteButton: {},
  description: {
    color: Colors.placeholderText,
    fontFamily: Fonts.Regular,
    fontSize: 12,
    marginBottom: 10,
  },
  editButton: {},
  iconContainer: {
    position: 'absolute',
    right: -5,
    top: -6,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    color: Colors.placeholderText,
    fontFamily: Fonts.Regular,
    fontSize: 10,
  },
  open: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    padding: 5,
  },
  private: {
    alignItems: 'center',
    backgroundColor: Colors.invited,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    padding: 5,
  },
  progressBarContainer: {
    backgroundColor: Colors.lightGray[200],
    borderRadius: 20,
    height: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    backgroundColor: Colors.primary,
    height: '100%',
  },
  progressText: {
    alignSelf: 'flex-end',
    color: Colors.textDark,
    fontFamily: Fonts.Regular,
    fontSize: 12,
  },
  progressWrapper: {
    gap: 10,
    justifyContent: 'center',
    marginTop: 15,
    position: 'relative',
  },
  rejected: {
    alignItems: 'center',
    backgroundColor: Colors.error,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    padding: 5,
  },
  statItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statLabel: {
    color: Colors.placeholderText,
    fontFamily: Fonts.Regular,
    fontSize: 12,
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
  title: {
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
    fontSize: 14,
    marginBottom: 5,
  },
});
