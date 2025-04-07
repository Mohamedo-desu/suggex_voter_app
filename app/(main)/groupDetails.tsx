import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import Suggestion from "@/components/Suggestion";
import SuggestionGroup from "@/components/SuggestionGroup";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";

const GroupDetails = () => {
  const { groupId } = useLocalSearchParams();

  const suggestions = useQuery(api.suggestion.fetchSuggestions, {
    groupId: groupId as Id<"groups">,
  });
  const groupDetails = useQuery(api.suggestion.fetchGroupDetails, {
    groupId: groupId as Id<"groups">,
  });

  const navigation = useNavigation();

  const renderItem = ({ item }) => <Suggestion item={item} />;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: groupDetails?.groupName,
    });
  }, [groupDetails]);

  if (suggestions === undefined) return <Loader />;

  return (
    <>
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={<SuggestionGroup item={groupDetails} />}
        ListEmptyComponent={<Empty text="No suggestions found" />}
        contentContainerStyle={{ padding: 15, gap: 10 }}
      />
    </>
  );
};

export default GroupDetails;

const styles = StyleSheet.create({});
