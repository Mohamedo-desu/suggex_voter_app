import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';

const Loader = ({ size = 'small' }: { size?: 'small' | 'large' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Colors.primary} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
  },
});
