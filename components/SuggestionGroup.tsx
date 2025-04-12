import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/suggestionGroup.styles";
import { GroupProps } from "@/types";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import AnimatedNumber from "react-native-animated-numbers";
import Animated, {
  LinearTransition,
  SlideInDown,
  SlideOutLeft,
} from "react-native-reanimated";

const SuggestionGroup: React.FC<{
  item: GroupProps;
  userId: string;
  index: number;
}> = ({ item, userId, index }) => {
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

  const statusColor: string = useMemo(() => {
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
      {
        backgroundColor: statusColor,
        opacity: groupActive || isOwner || isPrivate ? 1 : 0.6,
        padding: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      },
    ],
    [statusColor, groupActive, isPrivate, isOwner]
  );

  return (
    <Animated.View
      entering={SlideInDown.delay(index * 100)}
      exiting={SlideOutLeft}
      layout={LinearTransition}
    >
      <TouchableOpacity
        style={[
          styles.container,
          { opacity: groupActive || isOwner || isPrivate ? 1 : 0.6 },
        ]}
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
            size={14}
            color={Colors.placeholderText}
          />
        </View>
        <View style={styles.headerContainer}>
          <View style={styles.groupHeader}>
            <Image
              source={require("@/assets/icons/avatar.png")}
              contentFit="contain"
              style={styles.groupLogo}
              transition={300}
            />
            <Text
              style={styles.groupNameText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {displayName}
            </Text>
          </View>
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
      <View style={containerStyle}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: Fonts.Regular,
            color: Colors.white,
          }}
        >
          {item?.status === "open" ? "Active" : item?.status}
        </Text>
      </View>
    </Animated.View>
  );
};

export default SuggestionGroup;
