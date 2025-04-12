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
import { useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { FC, useEffect, useMemo, useRef } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
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

  const editGroup = useMutation(api.suggestion.editGroup);

  // BottomSheet refs
  const imageBottomSheetRef = useRef<BottomSheet>(null);
  const imageSnapPoints = useMemo(() => ["25%"], []);

  const openImagePickerSheet = () => {
    imageBottomSheetRef.current?.expand();
  };

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
      <GroupDetailsStickyHeader item={groupDetails} scrollY={scrollY} />

      {groupDetails && (
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
                openImagePickerSheet={openImagePickerSheet}
              />
              <Text style={styles.resultHeader}>Suggestions</Text>
            </>
          }
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          itemLayoutAnimation={LinearTransition.easing(Easing.ease).delay(100)}
        />
      )}

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
        <BottomSheetView style={styles.imagePickerContainer}>
          <Text style={styles.imagePickerTitle}>Select Image</Text>
          <View style={styles.imagePickerOptions}>
            <TouchableOpacity
              onPress={handleCameraPick}
              style={styles.iconButton}
            >
              <Ionicons name="camera" size={30} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGalleryPick}
              style={styles.iconButton}
            >
              <Ionicons name="image" size={30} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default GroupDetails;
