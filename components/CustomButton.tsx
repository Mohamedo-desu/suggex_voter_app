import React, { FC } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
}

const CustomButton: FC<CustomButtonProps> = ({ text, onPress, loading, style, textStyle = {} }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size={'small'} color="#fff" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    padding: 10,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: Fonts.Medium,
    fontSize: 14,
    textAlign: 'center',
  },
});
