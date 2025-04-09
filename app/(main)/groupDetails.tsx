import Empty from "@/components/Empty";
import GroupDetailsCard from "@/components/GroupDetailsCard";
import Loader from "@/components/Loader";
import Suggestion from "@/components/Suggestion";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GroupProps, SuggestionProps } from "@/types";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { FC, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";

const GroupDetails: FC = () => {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();
  const { userId } = useAuth();

  const currentUser = useQuery(
    api.user.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  // Query group suggestions.
  const suggestions = useQuery(api.suggestion.fetchSuggestions, {
    groupId: groupId as Id<"groups">,
  }) as SuggestionProps[];

  // Query group details.
  const groupDetails = useQuery(api.suggestion.fetchGroupDetails, {
    groupId: groupId as Id<"groups">,
  }) as GroupProps;

  // Render each suggestion item.
  const renderItem = ({ item }: { item: SuggestionProps }) => (
    <Suggestion item={item} userId={userId} />
  );

  const navigation = useNavigation();

  const onShare = async () => {
    try {
      Clipboard.setString(groupDetails?.invitationCode);
      ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity activeOpacity={0.8} hitSlop={10} onPress={onShare}>
          <Ionicons name="share-outline" size={25} color={Colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, []);

  // Navigate back automatically if the group is inactive.
  useEffect(() => {
    if (!groupDetails) {
      return;
    }

    if (
      groupDetails.status !== "open" &&
      groupDetails.userId !== currentUser?._id
    ) {
      router.back();
    }
  }, [groupDetails, router, userId]);

  useEffect(() => {
    // Check for deleted (or non-existent) group.
    if (groupDetails !== undefined && !groupDetails) {
      router.back();
    }
  }, [groupDetails, router]);

  if (suggestions === undefined) return <Loader />;

  return (
    <>
      <GroupDetailsCard groupDetails={groupDetails} />

      <FlatList
        data={suggestions}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Empty text="No suggestions found" />}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.resultHeader}>Suggestions</Text>
        }
      />
    </>
  );
};

export default GroupDetails;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 15,
    gap: 10,
  },

  resultHeader: {
    fontSize: 16,
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
  },
});
