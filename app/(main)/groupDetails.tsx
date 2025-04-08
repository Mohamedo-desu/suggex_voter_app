import Empty from "@/components/Empty";
import GroupDetailsCard from "@/components/GroupDetailsCard";
import Loader from "@/components/Loader";
import Suggestion from "@/components/Suggestion";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GroupProps, SuggestionProps } from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { FC, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";

const GroupDetails: FC = () => {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();

  // Query group suggestions.
  const suggestions = useQuery(api.suggestion.fetchSuggestions, {
    groupId: groupId as Id<"groups">,
  });

  // Query group details.
  const groupDetails = useQuery(api.suggestion.fetchGroupDetails, {
    groupId: groupId as Id<"groups">,
  }) as GroupProps;

  // Render each suggestion item.
  const renderItem = ({ item }: { item: SuggestionProps }) => (
    <Suggestion item={item} userId={user.id} />
  );

  const navigation = useNavigation();

  const onShare = async () => {
    try {
      Clipboard.setString(groupDetails?.invitationCode);
      ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={10}
          onPress={onShare}
          {...props}
        >
          <Ionicons name="share-outline" size={25} color={Colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, []);

  // Navigate back automatically if the group is inactive.
  useEffect(() => {
    if (!groupDetails) return;
    if (groupDetails.status !== "open") {
      router.back();
    }
  }, [groupDetails, router]);

  if (suggestions === undefined) return <Loader />;

  return (
    <>
      <GroupDetailsCard groupDetails={groupDetails} />
      {suggestions.length > 0 && (
        <>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListEmptyComponent={<Empty text="No suggestions found" />}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.resultHeader}>Suggestions</Text>
            }
          />
        </>
      )}
    </>
  );
};

export default GroupDetails;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 15,
    gap: 10,
  },

  resultHeader: {
    fontSize: 16,
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
  },
});
