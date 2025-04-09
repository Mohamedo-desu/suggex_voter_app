import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AnimatedNumber from "react-native-animated-numbers";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import { SuggestionProps } from "@/types";
import { router } from "expo-router";
import AwesomeAlert from "react-native-awesome-alerts";

interface SuggestionDetailsCardProps {
  item: SuggestionProps;
  userId: string;
}

const SuggestionDetailsCard: FC<SuggestionDetailsCardProps> = ({
  item,
  userId,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteSuggestion = useMutation(api.suggestion.deleteSuggestion);
  const toggleLike = useMutation(api.suggestion.toggleLike);

  // Fetch authenticated user details if a userId is provided.
  const currentUser = useQuery(
    api.user.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  // Compare current user with suggestion owner.
  const isOwner = currentUser?._id === item?.userId;
  const isClosed = item?.status === "closed";

  // Memoize creation time formatting.
  const creationTimeFormatted = useMemo(() => {
    return formatDistanceToNowStrict(new Date(item?._creationTime), {
      addSuffix: true,
    });
  }, [item?._creationTime]);

  const handleDelete = async () => {
    try {
      if (deleting) return;
      setDeleting(true);

      setShowAlert(false);

      await deleteSuggestion({ suggestionId: item?._id });
      setDeleting(false);
      router.back();
    } catch (error) {
      console.error("Failed to delete suggestion:", error);
    }
  };

  // Calculate progress relative to the endGoal.
  const progress = useMemo(
    () =>
      item?.endGoal > 0
        ? Math.min(item?.likesCount / item?.endGoal, 1) * 100
        : 0,
    [item?.endGoal, item?.likesCount]
  );

  // Set up Reanimated shared value for the progress animation.
  const progressShared = useSharedValue(0);
  useEffect(() => {
    progressShared.value = withTiming(progress, { duration: 1000 });
  }, [progress, progressShared]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressShared.value}%`,
  }));

  const hasLiked = item?.hasLiked;

  const handleLike = async () => {
    try {
      await toggleLike({ suggestionId: item._id });
    } catch (error) {
      console.log("Error liking or disliking a post", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {item?.title}
        </Text>
        {isOwner && (
          <View style={styles.actionButtons}>
            {deleting ? (
              <ActivityIndicator size={"small"} color={Colors.error} />
            ) : (
              <TouchableOpacity
                onPress={() => setShowAlert(true)}
                style={styles.actionButton}
                disabled={isClosed}
              >
                <FontAwesome5 name="trash" size={15} color={Colors.error} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <Text style={styles.description}>{item?.description}</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Created: </Text>
        <Text style={styles.detailValue}>{creationTimeFormatted}</Text>
      </View>
      <View style={styles.statsContainer}>
        {[
          { label: "upvotes", count: item?.likesCount },
          { label: "comments", count: item?.commentsCount },
        ].map(({ label, count }) => (
          <View key={label} style={styles.statItem}>
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
      <View style={styles.progressWrapper}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLike}
            hitSlop={10}
          >
            <Ionicons
              name={hasLiked ? "heart" : "heart-outline"}
              size={20}
              color={Colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      </View>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Delete"
        message="Are you sure you want to delete this suggestion? This action cannot be undone"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete"
        confirmButtonColor={Colors.error}
        onCancelPressed={() => setShowAlert(false)}
        onConfirmPressed={() => handleDelete()}
      />
    </View>
  );
};

export default SuggestionDetailsCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    elevation: 5,
    padding: 10,
    marginTop: 5,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 10,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.Regular,
    color: Colors.textDark,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: Fonts.Medium,
    color: Colors.placeholderText,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.textDark,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.Medium,
    color: Colors.placeholderText,
    marginRight: 4,
  },
  statNumber: {
    fontSize: 12,
    fontFamily: Fonts.Medium,
    color: Colors.primary,
  },
  progressWrapper: {
    marginTop: 15,
  },
  progressBar: {
    height: 5,
    backgroundColor: Colors.placeholderText,
    borderRadius: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.textDark,
  },
});
