import { FontAwesome5 } from "@expo/vector-icons";
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

import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";

// Define the item type
interface SuggestionGroupItem {
  _id: string;
  groupName: string;
  _creationTime: number | Date;
  suggestionsCount: number;
  approvedCount: number;
  rejectedCount: number;
  role: "owner" | "member" | string;
  status: "open" | "closed" | string;
}

// Props for the component
interface SuggestionGroupProps {
  item: SuggestionGroupItem | null;
}

const SuggestionGroup: React.FC<SuggestionGroupProps> = ({ item }) => {
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
  } = item;

  const groupActive: boolean = status === "open";

  const borderColor: string = useMemo(() => {
    if (!groupActive) return Colors.error;
    return role === "owner" ? Colors.primary : Colors.invited;
  }, [groupActive, role]);

  const displayName: string = useMemo(() => {
    return groupName.length > 25 ? groupName.slice(0, 25) + "..." : groupName;
  }, [groupName]);

  const containerStyle: StyleProp<ViewStyle> = useMemo(
    () => [
      styles.container,
      { borderBottomColor: borderColor, opacity: groupActive ? 1 : 0.6 },
    ],
    [borderColor, groupActive]
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
      disabled={!groupActive}
    >
      <View style={styles.iconContainer}>
        <FontAwesome5
          name={groupActive ? "box-open" : "box"}
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
            <AnimatedNumber
              animateToNumber={count}
              animationDuration={1000}
              fontStyle={styles.statNumber as TextStyle}
              includeComma={true}
            />
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
