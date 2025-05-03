import { useAuth } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';
import { router, useLocalSearchParams } from 'expo-router';
import React, { FC, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  LinearTransition,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Comment from '@/components/Comment';
import CustomButton from '@/components/CustomButton';
import Empty from '@/components/Empty';
import Loader from '@/components/Loader';
import SuggestionDetailsCard from '@/components/SuggestionDetailsCard';
import SuggestionDetailsStickyHeader from '@/components/SuggestionDetailsStickyHeader';
import Colors from '@/constants/Colors';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import styles from '@/styles/suggestionDetails.styles';
import { CommentProps, SuggestionProps } from '@/types';

const SuggestionDetails: FC = () => {
  const { suggestionId } = useLocalSearchParams();
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const suggestionDetails = useQuery(api.suggestion.fetchSuggestionDetails, {
    suggestionId: suggestionId as Id<'suggestions'>,
  }) as SuggestionProps;

  const comments = useQuery(api.comment.fetchComments, {
    suggestionId: suggestionId as Id<'suggestions'>,
  }) as CommentProps[];

  const addComment = useMutation(api.comment.addComment);

  const { userId } = useAuth();

  const currentUser = useQuery(api.user.getUserByClerkId, userId ? { clerkId: userId } : 'skip');

  useEffect(() => {
    if (
      suggestionDetails &&
      suggestionDetails?.userId !== currentUser?._id &&
      suggestionDetails?.status === 'closed'
    ) {
      router.back();
    } else if (suggestionDetails !== undefined && !suggestionDetails?._id) {
      router.back();
    }
  }, [suggestionDetails]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !suggestionId || addingComment) return;
    setAddingComment(true);
    try {
      await addComment({
        content: newComment,
        suggestionId: suggestionId as Id<'suggestions'>,
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment', error);
    } finally {
      setAddingComment(false);
    }
  };

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const renderComment = ({ item, index }: { item: CommentProps; index: number }) => {
    if (!userId) return null;
    return <Comment item={item} userId={userId} index={index} />;
  };

  const isOwner = suggestionDetails?.userId === currentUser?._id;
  const showCommentInput = suggestionDetails?.status === 'open';

  const { bottom, top } = useSafeAreaInsets();
  console.log(bottom);

  const renderCommentSection = () => (
    <>
      <SuggestionDetailsStickyHeader item={suggestionDetails} scrollY={scrollY} />
      {suggestionDetails && (
        <Animated.FlatList
          data={comments}
          keyExtractor={item => item._id}
          renderItem={renderComment}
          ListEmptyComponent={<Empty text="No comments found" />}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: 50 }]}
          showsVerticalScrollIndicator={false}
          itemLayoutAnimation={LinearTransition.easing(Easing.ease).delay(100)}
          ListHeaderComponent={
            <>
              {userId && <SuggestionDetailsCard item={suggestionDetails} userId={userId} />}
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
                  <CustomButton text="Post" loading={addingComment} onPress={handleAddComment} />
                </View>
              )}
              <Text style={styles.resultHeader}>Comments</Text>
            </>
          }
          style={{ zIndex: -1 }}
          onScroll={scrollHandler}
        />
      )}
    </>
  );

  const renderStatusMessage = () => (
    <>
      {userId && <SuggestionDetailsCard item={suggestionDetails} userId={userId} />}
      {suggestionDetails?.status === 'approved' && (
        <Empty text="This suggestion has been approved" />
      )}
      {suggestionDetails?.status === 'rejected' && (
        <Empty text="This suggestion has been rejected" />
      )}
      {suggestionDetails?.status === 'closed' && <Empty text="This suggestion has been closed" />}
    </>
  );

  if (suggestionDetails === undefined) {
    return <Loader />;
  }

  return (
    <>
      {isOwner || suggestionDetails?.status === 'open'
        ? renderCommentSection()
        : renderStatusMessage()}
    </>
  );
};

export default SuggestionDetails;
