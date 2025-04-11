import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/suggestionCard.styles";
import { SuggestionProps } from "@/types";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import { router } from "expo-router";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import AnimatedNumber from "react-native-animated-numbers";
import AwesomeAlert from "react-native-awesome-alerts";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const Suggestion: FC<{ item: SuggestionProps; userId: string }> = ({
  item,
  userId,
}) => {
  const [showAlert, setShowAlert] = useState(false);
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

  const handleDelete = async () => {
    if (isClosed || deleting) return;

    setDeleting(true);
    setShowAlert(false);

    try {
      setDeleting(true);
      await deleteSuggestion({ suggestionId: item?._id });
    } catch (error) {
      console.error("Failed to delete suggestion:", error);
    } finally {
      setDeleting(false);
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

  const displayName: string = useMemo(() => {
    return item?.title.length > 25
      ? item?.title.slice(0, 25) + "..."
      : item?.title;
  }, [item?.title]);

  const containerStyle = useMemo(
    () => [
      item?.status === "rejected" && styles.rejected,
      item?.status === "approved" && styles.approved,
      item?.status === "open" && styles.open,
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
    <>
      <TouchableOpacity
        style={[styles.container, { opacity: isClosed && !isOwner ? 0.5 : 1 }]}
        activeOpacity={0.8}
        disabled={isOwner ? false : isClosed || isPrivate}
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {displayName}
            </Text>
            {isOwner && (
              <View style={styles.actionButtons}>
                {deleting ? (
                  <ActivityIndicator size={"small"} color={Colors.error} />
                ) : (
                  <TouchableOpacity
                    onPress={onPressDelete}
                    style={styles.deleteButton}
                    disabled={isClosed}
                  >
                    <MaterialCommunityIcons
                      name="delete-forever-outline"
                      size={20}
                      color={Colors.error}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <Text
            style={styles.description}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item?.description}
          </Text>
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
    </>
  );
};

export default Suggestion;
