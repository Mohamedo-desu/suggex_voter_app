import { Image } from 'expo-image';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AnimatedNumber from 'react-native-animated-numbers';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

const GroupDetailsStickyHeader = ({ item, scrollY }) => {
  // Store the measured height of the header
  const [headerHeight, setHeaderHeight] = useState(0);

  // Capture the layout height on mount / change
  const onLayoutHeader = event => {
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
      pointerEvents: opacity === 0 ? 'none' : 'auto',
    };
  });

  const { groupName, status, suggestionsCount, approvedCount, rejectedCount, imageUrl } =
    item || {};

  const isActive = status === 'open';
  const imageSource = imageUrl ? imageUrl : require('@/assets/icons/avatar.png');
  return (
    <Animated.View style={[styles.stickyHeader, stickyHeaderStyle]} onLayout={onLayoutHeader}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image
          source={imageSource}
          contentFit="contain"
          style={styles.groupLogo}
          transition={300}
        />
        <View>
          <Text style={styles.groupNameText}>{groupName}</Text>
          <Text
            style={[styles.groupStatusText, { color: isActive ? Colors.primary : Colors.error }]}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {[
          { label: 'suggestions', count: suggestionsCount },
          { label: 'approved', count: approvedCount },
          { label: 'rejected', count: rejectedCount },
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

const styles = StyleSheet.create({
  groupLogo: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  groupNameText: {
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
    fontSize: 12,
  },
  groupStatusText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
  },
  statItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statLabel: {
    color: Colors.placeholderText,
    fontFamily: Fonts.Regular,
    fontSize: 12,
    marginRight: 4,
  },
  statNumber: {
    color: Colors.primary,
    fontFamily: Fonts.Regular,
    fontSize: 12,
  },
  statsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  stickyHeader: {
    alignItems: 'flex-start',
    backgroundColor: Colors.background,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1.5,
    elevation: 10,
    gap: 10,
    justifyContent: 'center',
    left: 0,
    paddingBottom: 5,
    paddingHorizontal: 10,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000,
  },
});
