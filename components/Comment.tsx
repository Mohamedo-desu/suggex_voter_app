import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { formatDistanceToNowStrict } from 'date-fns';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/comment.styles';
import { CommentProps } from '@/types';

interface CommentItemProps {
  item: CommentProps;
  userId: string;
  index: number;
}

const Comment = ({ item, userId, index }: CommentItemProps) => {
  const currentUser = useQuery(api.user.getUserByClerkId, userId ? { clerkId: userId } : 'skip');
  const isOwner = currentUser?._id === item.userId;

  const [deleting, setDeleting] = useState(false);

  const deleteComment = useMutation(api.comment.deleteComment);

  const handleDelete = async () => {
    try {
      if (deleting) return;

      setDeleting(true);

      await deleteComment({ commentId: item._id });
    } catch (error) {
      console.log('Error deleting comment', error);
    } finally {
      setDeleting(false);
    }
  };
  const onPressDelete = () => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this suggestion? This action cannot be undone',
      [
        {
          text: 'No, cancel',
          onPress: undefined,
          style: 'cancel',
        },
        {
          text: 'Yes, delete',
          onPress: () => handleDelete(),
          style: 'destructive',
        },
      ]
    );
  };
  return (
    <Animated.View
      entering={ZoomIn.delay(index * 100)}
      exiting={ZoomOut}
      style={{ marginHorizontal: 10 }}
    >
      <View style={styles.commentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.commentAuthor}>Anonymous</Text>
            <Text style={styles.commentAuthor}>
              {' '}
              •{' '}
              {formatDistanceToNowStrict(item._creationTime, {
                addSuffix: true,
              })}
            </Text>
          </View>
          {isOwner &&
            (deleting ? (
              <ActivityIndicator size={'small'} color={Colors.error} />
            ) : (
              <TouchableOpacity onPress={onPressDelete} activeOpacity={0.2} hitSlop={10}>
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
    </Animated.View>
  );
};

export default Comment;
