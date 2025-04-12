import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { Image } from "expo-image";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AnimatedNumber from "react-native-animated-numbers";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const SuggestionDetailsStickyHeader = ({ item, scrollY }) => {
  // Store the measured height of the header
  const [headerHeight, setHeaderHeight] = useState(0);

  // Capture the layout height on mount / change
  const onLayoutHeader = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  const lowerThreshold = headerHeight * 0.95;
  const upperThreshold = headerHeight * 1.6;

  const stickyHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [lowerThreshold, upperThreshold],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      pointerEvents: opacity === 0 ? "none" : "auto",
    };
  });

  const { title, status, likesCount, commentsCount, imageUrl } = item || {};
  const isActive = status === "open";

  return (
    <Animated.View
      style={[styles.stickyHeader, stickyHeaderStyle]}
      onLayout={onLayoutHeader}
    >
      <View style={{ gap: 10, width: "100%" }}>
        <View>
          <Text style={styles.groupNameText}>{title}</Text>
          <Text
            style={[
              styles.groupStatusText,
              { color: isActive ? Colors.primary : Colors.error },
            ]}
          >
            {isActive ? "Active" : "Inactive"}
          </Text>
        </View>
        {imageUrl && (
          <Image
            source={imageUrl}
            contentFit="cover"
            style={styles.groupLogo}
            transition={300}
          />
        )}
      </View>

      <View style={styles.statsContainer}>
        {[
          { label: "upvotes", count: likesCount },
          { label: "comments", count: commentsCount },
        ].map(({ label, count }) => (
          <View key={label} style={styles.statItemContainer}>
            <Text style={styles.statLabel}>{label}:</Text>
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

export default SuggestionDetailsStickyHeader;

const styles = StyleSheet.create({
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 1000,
    elevation: 10,
    paddingHorizontal: 10,
    gap: 10,
    paddingBottom: 5,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.border,
  },
  groupLogo: {
    width: "100%",
    height: 100,
  },
  groupNameText: {
    fontSize: 12,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
  },
  groupStatusText: {
    fontSize: 12,
    fontFamily: Fonts.Medium,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.placeholderText,
    marginRight: 4,
  },
  statNumber: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.primary,
  },
});
