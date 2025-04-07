import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AnimatedNumber from "react-native-animated-numbers";

const SuggestionGroup = ({ item }) => {
  const router = useRouter();

  if (!item) return null;
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderBottomColor:
            item?.role === "owner" ? Colors.primary : Colors.invited,
        },
      ]}
      onPress={() =>
        router.navigate({
          pathname: "/(main)/groupDetails",
          params: {
            groupId: item._id,
          },
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.headerContainer}>
        <Text
          style={styles.groupNameText}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {item.groupName}
        </Text>
        <Text style={styles.timeText}>
          {formatDistanceToNow(item._creationTime, { addSuffix: true })}
        </Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItemContainer}>
          <Text style={styles.statLabel}>suggestions : </Text>
          <AnimatedNumber
            animateToNumber={item.suggestionsCount}
            animationDuration={1000}
            fontStyle={styles.statNumber}
            includeComma={true}
          />
        </View>
        <View style={styles.statItemContainer}>
          <Text style={styles.statLabel}>approved : </Text>
          <AnimatedNumber
            animateToNumber={item.approvedCount}
            animationDuration={1000}
            fontStyle={styles.statNumber}
            includeComma={true}
          />
        </View>
        <View style={styles.statItemContainer}>
          <Text style={styles.statLabel}>rejected : </Text>
          <AnimatedNumber
            animateToNumber={item.rejectedCount}
            animationDuration={1000}
            fontStyle={styles.statNumber}
            includeComma={true}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SuggestionGroup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    elevation: 2,
    justifyContent: "center",
    height: 80,
    gap: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 3,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  groupNameText: {
    fontSize: 20,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.placeholderText,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  statItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
    color: Colors.placeholderText,
  },
  statNumber: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
    color: Colors.primary,
  },
});
