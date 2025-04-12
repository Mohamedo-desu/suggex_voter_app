import Colors from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import styles from "@/styles/suggestionDetailsCard.styles";
import { SuggestionProps } from "@/types";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import AnimatedNumber from "react-native-animated-numbers";
import AwesomeAlert from "react-native-awesome-alerts";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface SuggestionDetailsCardProps {
  item: SuggestionProps;
  userId: string;
}

const SuggestionDetailsCard: FC<SuggestionDetailsCardProps> = ({
  item,
  userId,
}) => {
  if (!item) return null;
  const [isLiked, setIsLiked] = useState(item?.hasLiked);

  const [showAlert, setShowAlert] = useState(false);

  const deleteSuggestion = useMutation(api.suggestion.deleteSuggestion);

  const toggleLike = useMutation(api.suggestion.toggleLike);

  const currentUser = useQuery(
    api.user.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  const isOwner = currentUser?._id === item?.userId;
  const isClosed = item?.status === "closed";

  const creationTimeFormatted = useMemo(
    () =>
      formatDistanceToNowStrict(new Date(item?._creationTime), {
        addSuffix: true,
      }),
    [item?._creationTime]
  );

  const handleDelete = async () => {
    try {
      await deleteSuggestion({ suggestionId: item?._id });
      router.back();
    } catch (error) {
      console.error("Failed to delete suggestion:", error);
    }
  };
  const onPressDelete = () => {
    if (Platform.OS === "web") {
      setShowAlert(true);
    } else {
      Alert.alert(
        "Delete",
        "Are you sure you want to delete this suggestion? This action cannot be undone",
        [
          {
            text: "No, cancel",
            onPress: undefined,
            style: "cancel",
          },
          {
            text: "Yes, delete",
            onPress: () => handleDelete(),
            style: "destructive",
          },
        ]
      );
    }
  };

  const progress = useMemo(() => {
    if (item?.endGoal > 0) {
      return Math.min(item?.likesCount / item?.endGoal, 1) * 100;
    }
    return 0;
  }, [item?.endGoal, item?.likesCount]);

  const progressShared = useSharedValue(0);
  useEffect(() => {
    progressShared.value = withTiming(progress, { duration: 1000 });
  }, [progress, progressShared]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressShared.value}%`,
  }));

  const handleLike = async () => {
    try {
      if (isLiked) {
        setIsLiked(false);
      } else {
        setIsLiked(true);
      }
      const newIsLiked = await toggleLike({ suggestionId: item?._id });
      setIsLiked(newIsLiked);
    } catch (error) {
      console.error("Error liking or disliking a post", error);
    }
  };

  const isActive = item?.status === "open";

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {item?.title}
          </Text>
          {isOwner && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() =>
                  router.navigate({
                    pathname: "/(main)/editSuggestion",
                    params: {
                      suggestionId: item._id,
                    },
                  })
                }
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="file-edit-outline"
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onPressDelete}
                style={styles.actionButton}
                disabled={isClosed}
              >
                <MaterialCommunityIcons
                  name="delete-forever-outline"
                  size={20}
                  color={Colors.error}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.groupStatusText,
            {
              color:
                isActive || item?.status === "approved"
                  ? Colors.primary
                  : Colors.error,
            },
          ]}
        >
          {item?.status === "open"
            ? "Active"
            : item?.status === "closed"
              ? "Inactive"
              : item?.status === "approved"
                ? "Approved"
                : "Rejected"}
        </Text>
        <Text style={styles.description}>{item?.description}</Text>
        {item?.imageUrl && (
          <Image
            source={{ uri: item?.imageUrl }}
            style={{ width: "100%", height: 200, marginBottom: 10 }}
            contentFit="cover"
          />
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created: </Text>
          <Text style={styles.detailValue}>{creationTimeFormatted}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Invitation Code: </Text>
          <Text style={styles.detailValue}>
            {item?.invitationCode.substring(0, 15)}...
          </Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => Clipboard.setString(item?.invitationCode)}
          >
            <FontAwesome5 name="copy" size={14} color={Colors.primary} />
          </TouchableOpacity>
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
            <Animated.View
              style={[styles.progressFill, progressAnimatedStyle]}
            />
          </View>
          <View style={styles.progressFooter}>
            {item.status === "open" && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleLike}
                hitSlop={10}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        </View>
      </View>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Delete"
        message="Are you sure you want to delete this suggestion? This action cannot be undone"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton
        showConfirmButton
        cancelText="No, cancel"
        confirmText="Yes, delete"
        confirmButtonColor={Colors.error}
        onCancelPressed={() => setShowAlert(false)}
        onConfirmPressed={handleDelete}
      />
    </>
  );
};

export default SuggestionDetailsCard;
