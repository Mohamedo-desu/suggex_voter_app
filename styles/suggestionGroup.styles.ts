import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 5,
    elevation: 0,
    gap: 10,
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  groupHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 5,
  },
  groupLogo: {
    borderRadius: 50,
    height: 35,
    width: 35,
  },
  groupNameText: {
    color: Colors.textDark,
    flex: 1,
    fontFamily: Fonts.Bold,
    fontSize: 14,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'space-between',
  },
  iconContainer: {
    position: 'absolute',
    right: -3,
    top: -6,
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
    justifyContent: 'space-between',
  },
  timeText: {
    color: Colors.placeholderText,
    fontFamily: Fonts.Regular,
    fontSize: 10,
    marginLeft: 5,
  },
});
