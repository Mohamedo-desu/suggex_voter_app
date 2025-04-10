import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import SuggestionGroup from "@/components/SuggestionGroup";
import Colors from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import { GroupProps } from "@/types";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";

const SuggestionsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { signOut } = useAuth();

  const groups = useQuery(api.suggestion.fetchUserGroups) as GroupProps[];

  const { userId } = useAuth();

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: GroupProps }) => {
    if (!userId) return null;
    return <SuggestionGroup item={item} userId={userId} />;
  };
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 15 }}
          activeOpacity={0.8}
          hitSlop={10}
          onPress={() => setShowAlert(true)}
        >
          <Ionicons
            name="log-out-outline"
            size={25}
            color={Colors.placeholderText}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  if (groups === undefined) {
    return <Loader />;
  }

  return (
    <>
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
        ListEmptyComponent={<Empty text="No suggestion groups found!" />}
      />
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Log Out"
        message="Are you sure you want to log out?"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, log out"
        confirmButtonColor={Colors.error}
        onCancelPressed={() => setShowAlert(false)}
        onConfirmPressed={() => signOut()}
      />
    </>
  );
};

export default SuggestionsScreen;
