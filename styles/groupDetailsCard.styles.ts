import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  cameraOverlay: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    bottom: 0,
    padding: 2,
    position: 'absolute',
    right: 0,
  },
  copyButton: {
    marginLeft: 15,
  },
  deleteButton: {},
  detailLabel: {
    color: Colors.placeholderText,
    fontFamily: Fonts.Regular,
    fontSize: 12,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 2,
  },
  detailValue: {
    color: Colors.textDark,
    fontFamily: Fonts.Regular,
    fontSize: 12,
  },
  editButton: {},
  groupLogo: {
    borderRadius: 50,
    height: 60,
    width: 60,
  },
  groupNameText: {
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
    fontSize: 13,
  },
  groupStatusText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  leftHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listHeaderContainer: {
    backgroundColor: Colors.background,
    marginTop: 5,
    padding: 10,
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
    marginTop: 10,
  },
});

export default styles;
