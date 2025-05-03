import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  appName: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  brandSection: {
    alignItems: 'center',
    marginTop: 50,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  illustration: {
    height: '100%',
    width: '100%',
  },
  illustrationContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loginSection: {
    marginBottom: 20,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: 20,
    width: 80,
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});
