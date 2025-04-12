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
import { getMimeType } from "@/utils/mimeType";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { nanoid } from "nanoid/non-secure";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  LinearTransition,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

const GroupDetails: FC = () => {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();
  const { userId } = useAuth();

  // Data queries
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
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  // State for group editing and image selection
  const [editedGroup, setEditedGroup] = useState({
    groupName: groupDetails?.groupName || "",
    invitationCode: groupDetails?.invitationCode || "",
    status: groupDetails?.status || "open",
  });

  const editGroup = useMutation(api.suggestion.editGroup);

  // BottomSheet refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const imageBottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const imageSnapPoints = useMemo(() => ["25%"], []);

  // Functions for opening/closing sheets
  const openEditSheet = () => bottomSheetRef.current?.expand();
  const closeEditSheet = () => {
    bottomSheetRef.current?.close();
    setEditedGroup({
      groupName: groupDetails?.groupName,
      invitationCode: groupDetails?.invitationCode,
      status: groupDetails?.status,
    });
  };
  const openImagePickerSheet = () => {
    imageBottomSheetRef.current?.expand();
  };

  // Save group profile changes
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

  // Update edited group when details change
  useEffect(() => {
    setEditedGroup({
      groupName: groupDetails?.groupName,
      invitationCode: groupDetails?.invitationCode,
      status: groupDetails?.status,
    });
  }, [groupDetails]);

  // Redirect if unauthorized or group not found
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

  // Reanimated scroll tracking
  const scrollY = useSharedValue(0);
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

  // Handle camera image selection
  const handleCameraPick = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Camera permissions are required to take a photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 0.7,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
    imageBottomSheetRef.current?.close();
  };

  // Handle gallery image selection
  const handleGalleryPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Media library permissions are required to select an image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 0.7,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
    imageBottomSheetRef.current?.close();
  };

  const uploadImage = async (uri: string) => {
    try {
      // Convert the selected image URI to a Blob.
      const imageResponse = await fetch(uri);
      const imageBlob = await imageResponse.blob();

      // Generate the upload URL.
      const uploadUrl = await generateUploadUrl();

      // Upload the blob to the generated URL.
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": getMimeType(uri),
        },
        body: imageBlob,
      });

      // Check for a successful upload.
      if (uploadResult.status !== 200) {
        const errorText = await uploadResult.text();
        throw new Error("Image upload failed: " + errorText);
      }

      // Parse the JSON response.
      const { storageId } = await uploadResult.json();

      await editGroup({
        groupId: groupId as Id<"groups">,
        storageId,
      });
    } catch (error) {
      console.error("Image upload failed", error);
      Alert.alert("Upload failed", "Could not upload image, please try again.");
    }
  };

  if (suggestions === undefined) return <Loader />;

  return (
    <>
      {/* Sticky Header*/}
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
              openImagePickerSheet={openImagePickerSheet}
            />
            <Text style={styles.resultHeader}>Suggestions</Text>
          </>
        }
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        itemLayoutAnimation={LinearTransition.easing(Easing.ease).delay(100)}
      />

      {/* Group Edit BottomSheet */}
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
                maxLength={40}
                numberOfLines={1}
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

      {/* Image Selection BottomSheet */}
      <BottomSheet
        ref={imageBottomSheetRef}
        index={-1}
        snapPoints={imageSnapPoints}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            onPress={() => imageBottomSheetRef.current?.close()}
          />
        )}
        handleIndicatorStyle={{ backgroundColor: Colors.primary }}
      >
        <BottomSheetView style={localStyles.imagePickerContainer}>
          <Text style={localStyles.imagePickerTitle}>Select Image</Text>
          <View style={localStyles.imagePickerOptions}>
            <TouchableOpacity
              onPress={handleCameraPick}
              style={localStyles.iconButton}
            >
              <Ionicons name="camera" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGalleryPick}
              style={localStyles.iconButton}
            >
              <Ionicons name="image" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const localStyles = StyleSheet.create({
  imagePickerContainer: {
    padding: 16,
    alignItems: "center",
  },
  imagePickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  imagePickerOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
});

export default GroupDetails;
