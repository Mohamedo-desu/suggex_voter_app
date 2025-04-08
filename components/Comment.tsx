import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { formatDistanceToNowStrict } from "date-fns";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Comment = ({ item }) => {
  return (
    <View style={styles.commentContainer}>
      <Text style={styles.commentAuthor}>
        {item.author} •{" "}
        {formatDistanceToNowStrict(new Date(item._creationTime), {
          addSuffix: true,
        })}
      </Text>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  commentsTitle: {
    fontSize: 18,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
    marginVertical: 10,
  },
  commentContainer: {
    padding: 10,
    backgroundColor: Colors.cardBackground || "#f8f8f8",
    borderRadius: 5,
    marginBottom: 10,
  },
  commentAuthor: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
    color: Colors.primary,
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
    fontFamily: Fonts.Regular,
    color: Colors.textDark,
  },
});
