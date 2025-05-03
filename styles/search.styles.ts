import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footerContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  header: {
    padding: 15,
  },
  iconWrapper: {
    padding: 5,
  },
  joinButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    padding: 15,
    width: '100%',
  },
  joinButtonText: {
    color: Colors.white,
    fontFamily: Fonts.Medium,
    fontSize: 16,
  },
  pasteButton: {
    marginTop: 15,
  },
  pasteButtonText: {
    color: Colors.white,
    fontFamily: Fonts.Regular,
    fontSize: 14,
  },
  resultHeader: {
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
    fontSize: 20,
    marginBottom: 5,
  },
  resultsContainer: {
    flex: 1,
    padding: 15,
  },
  searchInput: {
    color: Colors.textDark,
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
  },
  searchRow: {
    alignItems: 'center',
    backgroundColor: Colors.lightGray[300],
    borderRadius: 5,
    flexDirection: 'row',
    height: 50,
    paddingHorizontal: 10,
  },
});

export default styles;
