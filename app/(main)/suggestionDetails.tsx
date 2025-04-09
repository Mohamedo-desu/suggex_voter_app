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
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SuggestionDetails: FC = () => {
  const { suggestionId } = useLocalSearchParams();
  const [newComment, setNewComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const suggestionDetails = useQuery(api.suggestion.fetchSuggestionDetails, {
    suggestionId: suggestionId as Id<"suggestions">,
  }) as SuggestionProps;

  const comments = useQuery(api.comment.fetchComments, {
    suggestionId: suggestionId as Id<"suggestions">,
  }) as CommentProps[];

  const addComment = useMutation(api.comment.addComment);

  const { user } = useUser();

  useEffect(() => {
    if (suggestionDetails && suggestionDetails.status === "closed") {
      router.back();
    }
  }, [suggestionDetails]);

  const handleAddComment = async () => {
    try {
      if (!newComment.trim() || !suggestionId || addingComment) {
        return;
      }
      setAddingComment(true);
      await addComment({
        content: newComment,
        suggestionId: suggestionId as Id<"suggestions">,
      });
      setNewComment("");
    } catch (error) {
      console.log("Error adding comment", error);
    } finally {
      setAddingComment(false);
    }
  };

  if (suggestionDetails === undefined) return <Loader />;

  const renderComment = ({ item }: { item: any }) => (
    <Comment item={item} userId={user?.id} />
  );

  return (
    <>
      <SuggestionDetailsCard item={suggestionDetails} userId={user?.id} />
      <View
        style={{
          backgroundColor: Colors.background,
          elevation: 2,
          marginTop: 5,
          padding: 10,
          zIndex: 10,
          gap: 10,
        }}
      >
        <TextInput
          style={{
            color: Colors.textDark,
            fontSize: 14,
            fontFamily: Fonts.Regular,
            paddingVertical: 10,
          }}
          textAlignVertical="top"
          placeholder="Add a comment..."
          placeholderTextColor={Colors.textDark}
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={300}
        />
        <TouchableOpacity
          onPress={handleAddComment}
          disabled={!newComment.trim() || addingComment}
          style={{
            backgroundColor: Colors.primary,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            borderRadius: 5,
          }}
          activeOpacity={0.8}
        >
          {addingComment ? (
            <ActivityIndicator size={"small"} color={Colors.white} />
          ) : (
            <Text
              style={[
                { color: Colors.white, fontSize: 16 },
                !newComment.trim() && {},
              ]}
            >
              Post
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <FlatList
        data={comments}
        keyExtractor={(item) => item._id}
        renderItem={renderComment}
        ListEmptyComponent={<Empty text="No comments found" />}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.resultHeader}>Comments</Text>
          </>
        }
      />
    </>
  );
};

export default SuggestionDetails;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 15,
    gap: 10,
    paddingBottom: 25,
  },
  resultHeader: {
    fontSize: 16,
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
  },
});
