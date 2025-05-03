import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';

const Empty = ({ text }: { text: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  text: { color: Colors.placeholderText, fontSize: 13 },
});
