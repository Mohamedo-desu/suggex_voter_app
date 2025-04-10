import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import React, { FC } from "react";
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
} from "react-native";

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
  autoComplete,
  maxLength,
  keyboardType = "default",
  ...rest
}) => {
  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={handleChange}
          onBlur={handleBlur}
          keyboardType={keyboardType}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 15,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.Medium,
    fontSize: 15,
    color: Colors.textDark,
  },
  rightIconContainer: {
    marginLeft: 10,
  },
  error: {
    color: Colors.error,
    fontSize: 13,
    fontFamily: Fonts.Medium,
  },
});
