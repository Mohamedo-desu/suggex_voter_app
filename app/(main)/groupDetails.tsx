import { useAuth } from "@clerk/clerk-expo";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { nanoid } from "nanoid/non-secure";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import Empty from "@/components/Empty";
import GroupDetailsCard from "@/components/GroupDetailsCard";
import GroupDetailsStickyHeader from "@/components/GroupDetailsStickyHeader";
import Loader from "@/components/Loader";
import Suggestion from "@/components/Suggestion";
import Colors from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/groupDetails.styles";
import { GroupProps, SuggestionProps } from "@/types";

const GroupDetails: FC = () => {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();
  const { userId } = useAuth();

  // Fetch current user, suggestions, and group details.
  const currentUser = useQuery(
    api.user.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  const suggestions = useQuery(api.suggestion.fetchSuggestions, {
    groupId: groupId as Id<"groups">,
  }) as SuggestionProps[];
  const groupDetails = useQuery(api.suggestion.fetchGroupDetails, {
    groupId: groupId as Id<"groups">,
  }) as GroupProps;

  // State for group edit modal
  const [editedGroup, setEditedGroup] = useState({
    groupName: groupDetails?.groupName || "",
    invitationCode: groupDetails?.invitationCode || "",
    status: groupDetails?.status || "open",
  });
  const editGroup = useMutation(api.suggestion.editGroup);

  // BottomSheet Ref and configuration
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const openEditSheet = () => bottomSheetRef.current?.expand();
  const closeEditSheet = () => {
    bottomSheetRef.current?.close();
    setEditedGroup({
      groupName: groupDetails?.groupName,
      invitationCode: groupDetails?.invitationCode,
      status: groupDetails?.status,
    });
  };

  // Save changes to group
  const handleSaveProfile = async () => {
    try {
      await editGroup({
        groupId: groupId as Id<"groups">,
        groupName: editedGroup.groupName,
        invitationCode: editedGroup.invitationCode,
        status: editedGroup.status,
      });
    } catch (error) {
      console.error("Error updating profile", error);
    } finally {
      bottomSheetRef.current?.close();
    }
  };

  // Generate a new invitation code
  const generateNewInvitation = () => {
    const invitationCode = `grp${nanoid(5)}${userId}${nanoid(5)}G0g`;
    setEditedGroup((prev) => ({ ...prev, invitationCode }));
  };

  // Redirect away if group is not found or if the user is not authorized
  useEffect(() => {
    if (!groupDetails) return;
    if (
      groupDetails?.status !== "open" &&
      groupDetails?.userId !== currentUser?._id
    ) {
      router.back();
    }
  }, [groupDetails, router, currentUser]);

  useEffect(() => {
    if (groupDetails !== undefined && !groupDetails) {
      router.back();
    }
  }, [groupDetails, router]);

  // Reanimated shared value to track scroll Y offset
  const scrollY = useSharedValue(0);

  // Reanimated scroll handler that updates the shared value
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Render suggestion item
  const renderItem = ({
    item,
    index,
  }: {
    item: SuggestionProps;
    index: number;
  }) => {
    if (!userId) return null;
    return <Suggestion item={item} userId={userId} index={index} />;
  };

  if (suggestions === undefined) return <Loader />;

  return (
    <>
      <GroupDetailsStickyHeader item={groupDetails} scrollY={scrollY} />
      <Animated.FlatList
        data={suggestions}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Empty text="No suggestions found" />}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <GroupDetailsCard
              item={groupDetails}
              openEditSheet={openEditSheet}
            />
            <Text style={styles.resultHeader}>Suggestions</Text>
          </>
        }
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      />

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
        <BottomSheetView>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Group</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Group Name</Text>
              <CustomInput
                placeholder="group name"
                value={editedGroup.groupName}
                handleChange={(text) =>
                  setEditedGroup((prev) => ({ ...prev, groupName: text }))
                }
                placeholderTextColor={Colors.placeholderText}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editedGroup.status}
                  onValueChange={(itemValue) =>
                    setEditedGroup((prev) => ({ ...prev, status: itemValue }))
                  }
                >
                  <Picker.Item
                    label="open"
                    value="open"
                    style={styles.inputLabel}
                  />
                  <Picker.Item
                    label="closed"
                    value="closed"
                    style={styles.inputLabel}
                  />
                </Picker>
              </View>
            </View>
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
                style={{ height: 40 }}
                value={editedGroup.invitationCode}
                handleChange={(text) =>
                  setEditedGroup((prev) => ({ ...prev, invitationCode: text }))
                }
                placeholderTextColor={Colors.placeholderText}
                editable={false}
                textAlignVertical="top"
                multiline
              />
            </View>
            <CustomButton text="Save Changes" onPress={handleSaveProfile} />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default GroupDetails;
