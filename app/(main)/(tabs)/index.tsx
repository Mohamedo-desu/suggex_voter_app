import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import SuggestionGroup from "@/components/SuggestionGroup";
import Colors from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import { GroupItemProps } from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";

const SuggestionsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const groups = useQuery(api.suggestion.fetchUserGroups) as GroupItemProps[];

  const { user } = useUser();

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: GroupItemProps }) => {
    return <SuggestionGroup item={item} userId={user?.id} />;
  };

  if (groups === undefined) {
    return <Loader />;
  }

  return (
    <FlatList
      data={groups}
      refreshControl={
        <RefreshControl
          onRefresh={onRefresh}
          refreshing={refreshing}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={{ flexGrow: 1, padding: 15, gap: 10 }}
      ListEmptyComponent={<Empty text="No groups found" />}
    />
  );
};

export default SuggestionsScreen;

const styles = StyleSheet.create({});
