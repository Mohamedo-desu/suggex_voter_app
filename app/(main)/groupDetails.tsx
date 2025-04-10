import Empty from "@/components/Empty";
import GroupDetailsCard from "@/components/GroupDetailsCard";
import Loader from "@/components/Loader";
import Suggestion from "@/components/Suggestion";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/groupDetails.styles";
import { GroupProps, SuggestionProps } from "@/types";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { FC, useEffect } from "react";
import { FlatList, Text } from "react-native";

const GroupDetails: FC = () => {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();
  const { userId } = useAuth();

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

  const renderItem = ({ item }: { item: SuggestionProps }) => {
    if (!userId) return null;

    return <Suggestion item={item} userId={userId} />;
  };

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
    if (groupDetails !== undefined && !groupDetails) {
      router.back();
    }
  }, [groupDetails, router]);

  if (suggestions === undefined) return <Loader />;

  return (
    <>
      {userId && <GroupDetailsCard item={groupDetails} userId={userId} />}

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
        style={{ zIndex: -1 }}
      />
    </>
  );
};

export default GroupDetails;
