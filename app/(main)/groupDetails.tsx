import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome5 } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { FC, useEffect } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AnimatedNumber from "react-native-animated-numbers";

import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import Suggestion from "@/components/Suggestion";
import { api } from "@/convex/_generated/api";

/** Defines the details returned for a group. */
interface GroupDetailsData {
  userId: string;
  groupName: string;
  role: string;
  status: "open" | "closed" | string;
  _creationTime: number | Date;
  suggestionsCount: number;
  approvedCount: number;
  rejectedCount: number;
}

/** Defines the shape of a suggestion item. */
interface SuggestionItem {
  _id: string;
  // Additional fields required by the Suggestion component.
}

/** Defines the search parameters from the router. */
type LocalSearchParams = {
  groupId: string;
};

const GroupDetails: FC = () => {
  const { groupId } = useLocalSearchParams<LocalSearchParams>();
  const router = useRouter();
  const { user } = useUser();

  // Query group suggestions.
  const suggestions = useQuery(api.suggestion.fetchSuggestions, {
    groupId: groupId as Id<"groups">,
  }) as SuggestionItem[] | undefined;

  // Query group details.
  const groupDetails = useQuery(api.suggestion.fetchGroupDetails, {
    groupId: groupId as Id<"groups">,
  }) as GroupDetailsData | undefined;

  // Prepare the delete and update mutations.
  const deleteGroup = useMutation(api.suggestion.deleteGroup);

  // Render each suggestion item.
  const renderItem = ({ item }: { item: SuggestionItem }) => (
    <Suggestion item={item} userId={user?.id} />
  );

  // List header component shows group details.
  const ListHeaderComponent: FC = () => {
    if (!groupDetails) return null;

    const {
      groupName,
      role,
      status,
      _creationTime,
      suggestionsCount,
      approvedCount,
      rejectedCount,
    } = groupDetails;

    const isActive = status === "open";
    const creationTimeFormatted = formatDistanceToNowStrict(
      new Date(_creationTime),
      { addSuffix: true }
    );

    // Handler for updating the group's name.
    const handleEditGroup = () => {};

    // Delete handler called when the trash icon is pressed.
    const handleDeleteGroup = async () => {
      try {
        Alert.alert(
          "Delete Group",
          "Are you sure you want to delete this group?\nThis action cannot be undone.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await deleteGroup({ groupId: groupId as Id<"groups"> });
                router.back();
              },
            },
          ]
        );
      } catch (error) {
        console.error("Failed to delete group", error);
      }
    };

    return (
      <View style={styles.listHeaderContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.leftHeader}>
            <Text style={styles.groupNameText}>{groupName}</Text>
            {role === "owner" && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={handleEditGroup}
                  style={styles.editButton}
                >
                  <FontAwesome5 name="edit" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteGroup}
                  style={styles.deleteButton}
                >
                  <FontAwesome5 name="trash" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.groupStatusText,
              { color: isActive ? Colors.primary : Colors.error },
            ]}
          >
            {isActive ? "Active" : "Inactive"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Role: </Text>
          <Text style={styles.detailValue}>{role}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created: </Text>
          <Text style={styles.detailValue}>{creationTimeFormatted}</Text>
        </View>
        <View style={styles.statsContainer}>
          {[
            { label: "suggestions", count: suggestionsCount },
            { label: "approved", count: approvedCount },
            { label: "rejected", count: rejectedCount },
          ].map(({ label, count }) => (
            <View key={label} style={styles.statItemContainer}>
              <Text style={styles.statLabel}>{label} : </Text>
              <AnimatedNumber
                animateToNumber={count}
                animationDuration={1000}
                fontStyle={styles.statNumber}
                includeComma={true}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Navigate back automatically if the group is inactive.
  useEffect(() => {
    if (!groupDetails) return;
    if (groupDetails.status !== "open") {
      router.back();
    }
  }, [groupDetails, router]);

  if (suggestions === undefined) return <Loader />;

  return (
    <FlatList
      data={suggestions}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={<Empty text="No suggestions found" />}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default GroupDetails;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 15,
    gap: 10,
  },
  listHeaderContainer: {
    width: "100%",
    backgroundColor: Colors.background,
    elevation: 2,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  headerContainer: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  leftHeader: {
    flex: 1,
  },
  groupNameText: {
    fontSize: 22,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    position: "absolute",
    top: 0,
    right: 0,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    // Adjust as needed for spacing and positioning.
  },
  groupStatusText: {
    fontSize: 16,
    fontFamily: Fonts.Medium,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
    color: Colors.placeholderText,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: Fonts.Regular,
    color: Colors.textDark,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  statItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
    color: Colors.placeholderText,
  },
  statNumber: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
    color: Colors.primary,
  },
});
