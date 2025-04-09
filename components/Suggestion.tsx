import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import { SuggestionProps } from "@/types";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import { router } from "expo-router";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import AnimatedNumber from "react-native-animated-numbers";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const Suggestion: FC<{ item: SuggestionProps; userId: string }> = ({
  item,
  userId,
}) => {
  const [deleting, setDeleting] = useState(false);

  const deleteSuggestion = useMutation(api.suggestion.deleteSuggestion);

  const isPrivate: boolean = item?.status === "private";

  const creationTimeFormatted = useMemo(
    () =>
      formatDistanceToNowStrict(new Date(item?._creationTime), {
        addSuffix: true,
      }),
    [item?._creationTime]
  );

  const currentUser = useQuery(
    api.user.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  const isOwner = currentUser?._id === item?.userId;
  const isClosed = item?.status === "closed";

  const handleDelete = useCallback(() => {
    if (isClosed || deleting) return;

    Alert.alert(
      "Delete Suggestion",
      "Are you sure you want to delete this suggestion? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteSuggestion({ suggestionId: item?._id });
            } catch (error) {
              console.error("Failed to delete suggestion:", error);
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  }, [isClosed, item?._id]);

  const displayName: string = useMemo(() => {
    return item?.title.length > 25
      ? item?.title.slice(0, 25) + "..."
      : item?.title;
  }, [item?.title]);

  const containerStyle = useMemo(
    () => [
      styles.container,
      item?.status === "rejected" && styles.rejected,
      item?.status === "approved" && styles.approved,
      isClosed && styles.closed,
      isPrivate && styles.private,
    ],
    [item?.status, isClosed, isPrivate]
  );

  const progress = useMemo(
    () =>
      item?.endGoal > 0
        ? Math.min(item?.likesCount / item?.endGoal, 1) * 100
        : 0,
    [item?.endGoal, item?.likesCount]
  );

  const progressShared = useSharedValue(0);

  useEffect(() => {
    progressShared.value = withTiming(progress, { duration: 1000 });
  }, [progress, progressShared]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressShared.value}%`,
  }));

  return (
    <TouchableOpacity
      style={containerStyle}
      activeOpacity={0.8}
      disabled={isClosed || isPrivate}
      onPress={() =>
        router.navigate({
          pathname: "/(main)/suggestionDetails",
          params: { suggestionId: item?._id },
        })
      }
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={isPrivate ? "lock" : "newspaper-variant"}
          size={15}
          color={Colors.placeholderText}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {displayName}
        </Text>
        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          {item?.description}
        </Text>
        {isOwner && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.editButton}
              disabled={isClosed}
            >
              <FontAwesome5 name="edit" size={15} color={Colors.primary} />
            </TouchableOpacity>
            {deleting ? (
              <ActivityIndicator size={"small"} color={Colors.error} />
            ) : (
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteButton}
                disabled={isClosed}
              >
                <FontAwesome5 name="trash" size={15} color={Colors.error} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{creationTimeFormatted}</Text>
        <View style={styles.statsContainer}>
          {[
            { label: "upvotes", count: item?.likesCount },
            { label: "comments", count: item?.commentsCount },
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
      </View>

      {!isPrivate && (
        <View style={styles.progressWrapper}>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[styles.progressBarFill, progressAnimatedStyle]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Suggestion;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 5,
    elevation: 2,
    padding: 15,
  },
  rejected: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  approved: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  private: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.invited,
  },
  closed: {
    opacity: 0.5,
  },
  iconContainer: {
    position: "absolute",
    right: -5,
    top: -6,
  },
  content: {},
  title: {
    fontSize: 18,
    fontFamily: Fonts.Medium,
    color: Colors.textDark,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: Colors.placeholderText,
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    position: "absolute",
    top: 5,
    right: 0,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {},
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.placeholderText,
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
    fontFamily: Fonts.Medium,
    color: Colors.placeholderText,
  },
  statNumber: {
    fontSize: 12,
    fontFamily: Fonts.Medium,
    color: Colors.primary,
  },
  progressWrapper: {
    marginTop: 15,
    position: "relative",
    justifyContent: "center",
    gap: 10,
  },
  progressBarContainer: {
    height: 5,
    backgroundColor: Colors.placeholderText,
    borderRadius: 20,
    overflow: "hidden",
  },
  progressText: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.textDark,
    backgroundColor: "transparent",
    alignSelf: "flex-end",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
});
