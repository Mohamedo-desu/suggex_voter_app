import * as Application from 'expo-application';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/Colors';

const PrivacyTerms = () => {
  const openPrivacyPolicy = () => {
    const url = 'https://www.termsfeed.com/live/b9b83488-3035-4933-af3e-8cc8e964e4b4';
    Linking.openURL(url).catch(err => console.error('Failed to open Privacy Policy URL:', err));
  };

  return (
    <View style={styles.footer}>
      <Text style={[styles.versionCodeText, { color: Colors.placeholderText }]}>
        v{Application.nativeApplicationVersion}
      </Text>

      <Text>By using, you agree to our</Text>
      <TouchableOpacity
        hitSlop={10}
        activeOpacity={0.8}
        style={styles.footerTextContainer}
        onPress={openPrivacyPolicy}
      >
        <Text style={styles.footerText}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrivacyTerms;

const styles = StyleSheet.create({
  footer: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
  },
  footerText: {
    color: Colors.primary,
    fontSize: 10,
    textDecorationLine: 'underline',
  },
  footerTextContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 5,
  },
  versionCodeText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
