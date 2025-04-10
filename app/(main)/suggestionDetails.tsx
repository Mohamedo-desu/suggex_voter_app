import Comment from "@/components/Comment";
import CustomButton from "@/components/CustomButton";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import SuggestionDetailsCard from "@/components/SuggestionDetailsCard";
import Colors from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import styles from "@/styles/suggestionDetails.styles";
import { CommentProps, SuggestionProps } from "@/types";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { FC, useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";

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
  const { userId } = useAuth();
  const currentUser = useQuery(
    api.user.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  useEffect(() => {
    if (
      suggestionDetails &&
      suggestionDetails.userId !== currentUser?._id &&
      suggestionDetails.status === "closed"
    ) {
      router.back();
    }
  }, [suggestionDetails]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !suggestionId || addingComment) return;
    setAddingComment(true);
    try {
      await addComment({
        content: newComment,
        suggestionId: suggestionId as Id<"suggestions">,
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment", error);
    } finally {
      setAddingComment(false);
    }
  };

  if (suggestionDetails === undefined) {
    return <Loader />;
  }

  const renderComment = ({ item }: { item: CommentProps }) => {
    if (!userId) return null;
    return <Comment item={item} userId={userId} />;
  };
  const isOwner = suggestionDetails.userId === currentUser?._id;
  const showCommentInput = suggestionDetails.status === "open";

  return (
    <>
      {userId && (
        <SuggestionDetailsCard item={suggestionDetails} userId={userId} />
      )}
      {isOwner ? (
        <>
          {showCommentInput && (
            <View style={styles.commentContainer}>
              <TextInput
                style={styles.commentInput}
                textAlignVertical="top"
                placeholder="Add a comment..."
                placeholderTextColor={Colors.textDark}
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={300}
              />

              <CustomButton
                text="Post"
                loading={addingComment}
                onPress={handleAddComment}
              />
            </View>
          )}
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={renderComment}
            ListEmptyComponent={<Empty text="No comments found" />}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.resultHeader}>Comments</Text>
            }
            style={{ zIndex: -1 }}
          />
        </>
      ) : (
        <>
          {suggestionDetails.status === "open" ? (
            <>
              <View style={styles.commentContainer}>
                <TextInput
                  style={styles.commentInput}
                  textAlignVertical="top"
                  placeholder="Add a comment..."
                  placeholderTextColor={Colors.textDark}
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  maxLength={300}
                />

                <CustomButton
                  text="Post"
                  loading={addingComment}
                  onPress={handleAddComment}
                />
              </View>
              <FlatList
                data={comments}
                keyExtractor={(item) => item._id}
                renderItem={renderComment}
                ListEmptyComponent={<Empty text="No comments found" />}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <Text style={styles.resultHeader}>Comments</Text>
                }
              />
            </>
          ) : suggestionDetails.status === "approved" ? (
            <Empty text="This suggestion has been approved" />
          ) : suggestionDetails.status === "rejected" ? (
            <Empty text="This suggestion has been rejected" />
          ) : (
            <Empty text="This suggestion has been closed" />
          )}
        </>
      )}
    </>
  );
};

export default SuggestionDetails;
