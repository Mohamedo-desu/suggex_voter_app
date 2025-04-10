import Colors from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/comment.styles";
import { CommentProps } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CommentItemProps {
  item: CommentProps;
  userId: string;
}

const Comment = ({ item, userId }: CommentItemProps) => {
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
  const onPressDelete = () => {
    if (Platform.OS === "web") {
      handleDelete();
    } else {
      Alert.alert(
        "Delete",
        "Are you sure you want to delete this suggestion? This action cannot be undone",
        [
          {
            text: "No, cancel",
            onPress: undefined,
            style: "cancel",
          },
          {
            text: "Yes, delete",
            onPress: () => handleDelete(),
            style: "destructive",
          },
        ]
      );
    }
  };
  return (
    <>
      <View style={styles.commentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.commentAuthor}>Anonymous</Text>
            <Text style={styles.commentAuthor}>
              {" "}
              •{" "}
              {formatDistanceToNowStrict(item._creationTime, {
                addSuffix: true,
              })}
            </Text>
          </View>
          {isOwner &&
            (deleting ? (
              <ActivityIndicator size={"small"} color={Colors.error} />
            ) : (
              <TouchableOpacity
                onPress={onPressDelete}
                activeOpacity={0.2}
                hitSlop={10}
              >
                <MaterialCommunityIcons
                  name="delete-forever-outline"
                  size={20}
                  color={Colors.error}
                />
              </TouchableOpacity>
            ))}
        </View>

        <Text style={styles.commentText}>{item.content}</Text>
      </View>
    </>
  );
};

export default Comment;
