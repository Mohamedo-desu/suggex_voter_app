import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { FC, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";

import Comment from "@/components/Comment";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import SuggestionDetailsCard from "@/components/SuggestionDetailsCard";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// --- TypeScript Interfaces ---

// Define the shape of a comment item.
interface CommentItem {
  _id: string;
  text: string;
  author: string;
  _creationTime: number | Date;
}

const SuggestionDetails: FC = () => {
  const { suggestionId } = useLocalSearchParams();

  const suggestionDetails = useQuery(api.suggestion.fetchSuggestionDetails, {
    suggestionId: suggestionId as Id<"suggestions">,
  });

  const comments = useQuery(api.comment.fetchComments, {
    suggestionId: suggestionId as Id<"suggestions">,
  });

  const { user } = useUser();

  useEffect(() => {
    if (suggestionDetails && suggestionDetails.status === "closed") {
      router.back();
    }
  }, [suggestionDetails]);

  if (suggestionDetails === undefined) return <Loader />;

  const renderComment = ({ item }: { item: CommentItem }) => (
    <Comment item={item} userId={user?.id} />
  );

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item._id}
      renderItem={renderComment}
      ListHeaderComponent={
        <SuggestionDetailsCard item={suggestionDetails} userId={user?.id} />
      }
      ListEmptyComponent={<Empty text="No comments found" />}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default SuggestionDetails;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 15,
  },
});
