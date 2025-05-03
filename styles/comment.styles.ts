import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

export const styles = StyleSheet.create({
  commentAuthor: {
    color: Colors.primary,
    fontFamily: Fonts.Regular,
    fontSize: 10,
    marginBottom: 5,
  },
  commentContainer: {
    backgroundColor: Colors.background,
    borderRadius: 5,
    padding: 10,
  },
  commentText: {
    color: Colors.textDark,
    fontFamily: Fonts.Regular,
    fontSize: 12,
  },
  header: { alignItems: 'center', flexDirection: 'row' },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
