import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GroupItemProps } from "@/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AnimatedNumber from "react-native-animated-numbers";

const GroupDetailsCard = ({
  groupDetails,
}: {
  groupDetails: GroupItemProps;
}) => {
  if (!groupDetails) return null;

  const deleteGroup = useMutation(api.suggestion.deleteGroup);

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
              await deleteGroup({ groupId: groupDetails._id as Id<"groups"> });
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

export default GroupDetailsCard;

const styles = StyleSheet.create({
  listHeaderContainer: {
    backgroundColor: Colors.background,
    elevation: 5,
    padding: 10,
    marginTop: 5,
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
