import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import { GroupProps } from "@/types";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import AnimatedNumber from "react-native-animated-numbers";

const SuggestionGroup: React.FC<{ item: GroupProps; userId: string }> = ({
  item,
  userId,
}) => {
  const router = useRouter();

  if (!item) return null;

  const {
    _id,
    groupName,
    _creationTime,
    suggestionsCount,
    approvedCount,
    rejectedCount,
    role,
    status,
  } = item || {};

  const groupActive: boolean = status === "open";
  const isPrivate: boolean = status === "private";

  const borderColor: string = useMemo(() => {
    if (!groupActive && !isPrivate) return Colors.error;
    return role === "owner" ? Colors.primary : Colors.invited;
  }, [groupActive, role, isPrivate]);

  const displayName: string = useMemo(() => {
    return groupName.length > 25 ? groupName.slice(0, 25) + "..." : groupName;
  }, [groupName]);

  const currentUser = useQuery(
    api.user.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  const isOwner = currentUser?._id === item.userId;

  const containerStyle: StyleProp<ViewStyle> = useMemo(
    () => [
      styles.container,
      {
        borderBottomColor: borderColor,
        opacity: groupActive || isOwner || isPrivate ? 1 : 0.6,
      },
    ],
    [borderColor, groupActive, isPrivate, isOwner]
  );

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={() =>
        router.navigate({
          pathname: "/(main)/groupDetails",
          params: { groupId: _id },
        })
      }
      activeOpacity={0.8}
      disabled={isOwner ? false : !groupActive || isPrivate}
    >
      <View style={styles.iconContainer}>
        <FontAwesome5
          name={isPrivate ? "lock" : groupActive ? "box-open" : "box"}
          size={20}
          color={Colors.placeholderText}
        />
      </View>
      <View style={styles.headerContainer}>
        <Text
          style={styles.groupNameText}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {displayName}
        </Text>
        <Text style={styles.timeText}>
          {formatDistanceToNowStrict(new Date(_creationTime), {
            addSuffix: false,
          })}
        </Text>
      </View>
      <View style={styles.statsContainer}>
        {[
          { label: "suggestions", count: suggestionsCount },
          { label: "approved", count: approvedCount },
          { label: "rejected", count: rejectedCount },
        ].map(({ label, count }) => (
          <View key={label} style={styles.statItemContainer}>
            <Text style={styles.statLabel}>{label} : </Text>
            {isPrivate ? (
              <Ionicons
                name="eye-off"
                size={14}
                color={Colors.lightGray[500]}
              />
            ) : (
              <AnimatedNumber
                animateToNumber={count}
                animationDuration={1000}
                fontStyle={styles.statNumber as TextStyle}
                includeComma={true}
              />
            )}
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default SuggestionGroup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 5,
    elevation: 2,
    justifyContent: "center",
    height: 80,
    paddingHorizontal: 15,
    borderBottomWidth: 3,
    gap: 10,
  },
  iconContainer: {
    position: "absolute",
    right: -3,
    top: -6,
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
  },
  statItemContainer: {
    flex: 1,
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
