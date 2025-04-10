import Colors from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/comment.styles";
import { CommentProps } from "@/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";

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
  const [showAlert, setShowAlert] = useState(false);

  const deleteComment = useMutation(api.comment.deleteComment);

  const handleDelete = async () => {
    try {
      if (deleting) return;

      setDeleting(true);
      setShowAlert(false);

      await deleteComment({ commentId: item._id });
    } catch (error) {
      console.log("Error deleting comment", error);
    } finally {
      setDeleting(false);
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
                onPress={() => {
                  if (Platform.OS === "web") {
                    handleDelete();
                  } else {
                    setShowAlert(true);
                  }
                }}
                activeOpacity={0.2}
                hitSlop={10}
              >
                <FontAwesome5 name="trash" size={15} color={Colors.error} />
              </TouchableOpacity>
            ))}
        </View>

        <Text style={styles.commentText}>{item.content}</Text>
      </View>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Delete"
        message="Are you sure you want to delete this comment? This action cannot be undone"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete"
        confirmButtonColor={Colors.error}
        onCancelPressed={() => setShowAlert(false)}
        onConfirmPressed={() => handleDelete()}
      />
    </>
  );
};

export default Comment;
