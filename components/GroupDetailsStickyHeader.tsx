import Colors from "@/constants/colors";
import { styles } from "@/styles/groupDetails.styles";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import AnimatedNumber from "react-native-animated-numbers";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const GroupDetailsStickyHeader = ({ item, scrollY }) => {
  const stickyHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [80, 150],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      pointerEvents: opacity === 0 ? "none" : "auto",
    };
  });

  const {
    groupName,
    status,
    suggestionsCount,
    approvedCount,
    rejectedCount,
    imageUrl,
  } = item || {};

  const isActive = status === "open";
  const imageSource = imageUrl
    ? imageUrl
    : require("@/assets/icons/avatar.png");
  return (
    <Animated.View style={[styles.stickyHeader, stickyHeaderStyle]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Image
          source={
            typeof imageSource === "string" ? { uri: imageSource } : imageSource
          }
          contentFit="contain"
          style={styles.groupLogo}
          transition={300}
        />
        <View>
          <Text style={styles.groupNameText}>{groupName}</Text>
          <Text
            style={[
              styles.groupStatusText,
              { color: isActive ? Colors.primary : Colors.error },
            ]}
          >
            {isActive ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {[
          { label: "suggestions", count: suggestionsCount },
          { label: "approved", count: approvedCount },
          { label: "rejected", count: rejectedCount },
        ].map(({ label, count }) => (
          <View key={label} style={styles.statItemContainer}>
            <Text style={styles.statLabel}>{label} : </Text>
            <AnimatedNumber
              animateToNumber={count}
              animationDuration={1000}
              fontStyle={styles.statNumber}
              includeComma
            />
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

export default GroupDetailsStickyHeader;
