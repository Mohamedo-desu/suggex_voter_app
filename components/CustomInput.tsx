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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.inputBackground,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 15,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.Regular,
    fontSize: 12,
    color: Colors.textDark,
  },
  error: {
    color: Colors.error,
    fontSize: 13,
    fontFamily: Fonts.Medium,
  },
});
