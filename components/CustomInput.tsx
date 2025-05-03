import React, { FC } from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface CustomInputProps extends TextInputProps {
  placeholder: string;
  errors?: string;
  touched?: boolean;
  value: string;
  handleChange: (value: string) => void;
  handleBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  style?: StyleProp<TextStyle>;
}

const CustomInput: FC<CustomInputProps> = ({
  placeholder,
  errors,
  touched,
  value,
  handleChange,
  handleBlur,
  style,
  ...rest
}) => {
  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={handleChange}
          onBlur={handleBlur}
          cursorColor={Colors.primary}
          placeholder={placeholder}
          style={[styles.input, style]}
          placeholderTextColor={Colors.placeholderText}
          {...rest}
        />
      </View>
      {errors && touched && <Text style={styles.error}>{errors}</Text>}
    </>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  error: {
    color: Colors.error,
    fontFamily: Fonts.Medium,
    fontSize: 13,
  },
  input: {
    color: Colors.textDark,
    flex: 1,
    fontFamily: Fonts.Regular,
    fontSize: 12,
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.border,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
  },
});
