import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  TouchableOpacity,
  View,
} from "react-native";

interface CustomInputProps extends TextInputProps {
  placeholder: string;
  rightIcon?: string;
  errors?: string;
  touched?: boolean;
  value: string;
  onPressRightIcon?: () => void;
  handleChange: (value: string) => void;
  handleBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  style?: StyleProp<TextStyle>;
}

const CustomInput: FC<CustomInputProps> = ({
  placeholder,
  rightIcon,
  errors,
  touched,
  value,
  handleChange,
  handleBlur,
  onPressRightIcon,
  style,
  autoComplete,
  maxLength,
  keyboardType = "default",
  secureTextEntry = false,
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
          autoCapitalize="none"
          cursorColor={Colors.primary}
          autoComplete={autoComplete}
          maxLength={maxLength}
          numberOfLines={1}
          placeholder={placeholder}
          style={[styles.input, style]}
          placeholderTextColor={Colors.placeholderText}
          secureTextEntry={secureTextEntry}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onPressRightIcon}
            style={styles.rightIconContainer}
          >
            <MaterialCommunityIcons
              name={rightIcon}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
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
