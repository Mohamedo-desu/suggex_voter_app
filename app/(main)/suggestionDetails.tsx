import Comment from "@/components/Comment";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import SuggestionDetailsCard from "@/components/SuggestionDetailsCard";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CommentProps, SuggestionProps } from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { FC, useEffect } from "react";
import { FlatList, StyleSheet, Text } from "react-native";

const SuggestionDetails: FC = () => {
  const { suggestionId } = useLocalSearchParams();

  const suggestionDetails = useQuery(api.suggestion.fetchSuggestionDetails, {
    suggestionId: suggestionId as Id<"suggestions">,
  }) as SuggestionProps;

  const comments = useQuery(api.comment.fetchComments, {
    suggestionId: suggestionId as Id<"suggestions">,
  }) as CommentProps[];

  const { user } = useUser();

  useEffect(() => {
    if (suggestionDetails && suggestionDetails.status === "closed") {
      router.back();
    }
  }, [suggestionDetails]);

  if (suggestionDetails === undefined) return <Loader />;

  const renderComment = ({ item }: { item: any }) => (
    <Comment item={item} userId={user?.id} />
  );

  return (
    <>
      <SuggestionDetailsCard item={suggestionDetails} userId={user?.id} />

      <FlatList
        data={comments}
        keyExtractor={(item) => item._id}
        renderItem={renderComment}
        ListEmptyComponent={<Empty text="No comments found" />}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.resultHeader}>Comments</Text>}
      />
    </>
  );
};

export default SuggestionDetails;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 15,
  },
  resultHeader: {
    fontSize: 16,
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
  },
});
