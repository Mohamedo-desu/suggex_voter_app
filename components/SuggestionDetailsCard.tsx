import Colors from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import styles from "@/styles/suggestionDetailsCard.styles";
import { SuggestionProps } from "@/types";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Clipboard from "@react-native-clipboard/clipboard";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import { router } from "expo-router";
import { nanoid } from "nanoid/non-secure";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import AnimatedNumber from "react-native-animated-numbers";
import AwesomeAlert from "react-native-awesome-alerts";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";

interface SuggestionDetailsCardProps {
  item: SuggestionProps;
  userId: string;
}

const SuggestionDetailsCard: FC<SuggestionDetailsCardProps> = ({
  item,
  userId,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [editedSuggestion, setEditedSuggestion] = useState({
    invitationCode: item?.invitationCode || "",
    status: item?.status || "open",
    endGoal: item?.endGoal.toString() || "",
  });

  const deleteSuggestion = useMutation(api.suggestion.deleteSuggestion);
  const editSuggestion = useMutation(api.suggestion.editSuggestion);
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

  const handleSaveProfile = async () => {
    try {
      await editSuggestion({
        suggestionId: item?._id as Id<"suggestions">,
        invitationCode: editedSuggestion.invitationCode,
        status: editedSuggestion.status,
        endGoal: parseInt(editedSuggestion.endGoal),
      });
    } catch (error) {
      console.error("Error updating profile", error);
    } finally {
      bottomSheetRef.current?.close();
    }
  };

  const generateNewInvitation = () => {
    const invitationCode = `sug${nanoid(5)}${item?.groupId}${nanoid(5)}S0s`;
    setEditedSuggestion((prev) => ({ ...prev, invitationCode }));
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

  const hasLiked = item?.hasLiked;
  const handleLike = async () => {
    try {
      await toggleLike({ suggestionId: item?._id });
    } catch (error) {
      console.error("Error liking or disliking a post", error);
    }
  };

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["90%"], []);

  const openEditSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const closeEditSheet = () => {
    bottomSheetRef.current?.close();

    setEditedSuggestion({
      invitationCode: item?.invitationCode,
      status: item?.status,
      endGoal: item?.endGoal.toString(),
    });
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
              <TouchableOpacity onPress={openEditSheet} activeOpacity={0.8}>
                <MaterialCommunityIcons
                  name="file-edit-outline"
                  size={20}
                  color={Colors.invited}
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
                  name={hasLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            onPress={closeEditSheet}
          />
        )}
        handleIndicatorStyle={{ backgroundColor: Colors.primary }}
      >
        <BottomSheetScrollView contentContainerStyle={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Suggestion</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editedSuggestion.status}
                onValueChange={(itemValue) =>
                  setEditedSuggestion((prev) => ({
                    ...prev,
                    status: itemValue,
                  }))
                }
              >
                <Picker.Item
                  label="open"
                  value="open"
                  style={styles.inputLabel}
                />
                <Picker.Item
                  label="Approved"
                  value="approved"
                  style={styles.inputLabel}
                />
                <Picker.Item
                  label="Rejected"
                  value="rejected"
                  style={styles.inputLabel}
                />
                <Picker.Item
                  label="Closed"
                  value="closed"
                  style={styles.inputLabel}
                />
              </Picker>
            </View>
          </View>
          {item.status === "open" && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                End Goal for this Suggestion
              </Text>
              <CustomInput
                placeholder="group name"
                value={editedSuggestion.endGoal}
                handleChange={(text) =>
                  setEditedSuggestion((prev) => ({
                    ...prev,
                    endGoal: text,
                  }))
                }
                placeholderTextColor={Colors.placeholderText}
              />
            </View>
          )}
          <View style={styles.inputContainer}>
            <View style={styles.invitationRow}>
              <Text style={styles.inputLabel}>Invitation Code</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={generateNewInvitation}
              >
                <Text style={[styles.inputLabel, { color: Colors.primary }]}>
                  Generate New
                </Text>
              </TouchableOpacity>
            </View>

            <CustomInput
              placeholder="Invitation Code"
              style={[{ height: 40 }]}
              value={editedSuggestion.invitationCode}
              handleChange={(text) =>
                setEditedSuggestion((prev) => ({
                  ...prev,
                  invitationCode: text,
                }))
              }
              placeholderTextColor={Colors.placeholderText}
              editable={false}
              textAlignVertical="top"
              multiline
            />
          </View>

          <CustomButton text="Save Changes" onPress={handleSaveProfile} />
        </BottomSheetScrollView>
      </BottomSheet>
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
