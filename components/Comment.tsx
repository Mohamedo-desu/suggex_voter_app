import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import { FontAwesome5 } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Comment = ({ item, userId }) => {
  const currentUser = useQuery(
    api.user.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  const isOwner = currentUser?._id === item.userId;

  const [deleting, setDeleting] = useState(false);

  const deleteComment = useMutation(api.comment.deleteComment);
  const handleDelete = async () => {
    try {
      if (deleting) return;

      setDeleting(true);
      await deleteComment({ commentId: item._id });
    } catch (error) {
      console.log("Error deleting comment", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={styles.commentContainer}>
      {isOwner && (
        <View style={styles.actionButtons}>
          {deleting ? (
            <ActivityIndicator size={"small"} color={Colors.error} />
          ) : (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deleteButton}
              activeOpacity={0.8}
            >
              <FontAwesome5 name="trash" size={15} color={Colors.error} />
            </TouchableOpacity>
          )}
        </View>
      )}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.commentAuthor}>Anonymous</Text>
        <Text style={styles.commentAuthor}>
          {item.author} •{" "}
          {formatDistanceToNowStrict(new Date(item._creationTime), {
            addSuffix: true,
          })}
        </Text>
      </View>
      <Text style={styles.commentText}>{item.content}</Text>
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  commentContainer: {
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 5,
  },
  commentAuthor: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
    color: Colors.primary,
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
    color: Colors.textDark,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    position: "absolute",
    top: 10,
    right: 10,
  },

  deleteButton: {},
});
