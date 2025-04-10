import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import React, { FC } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
}

const CustomButton: FC<CustomButtonProps> = ({
  text,
  onPress,
  loading,
  style,
  textStyle = {},
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size={"small"} color="#fff" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonText: {
    textAlign: "center",
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.Medium,
  },
});
