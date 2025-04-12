import Colors from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import styles from "@/styles/groupDetailsCard.styles";
import { GroupProps } from "@/types";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useMutation } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AnimatedNumber from "react-native-animated-numbers";
import AwesomeAlert from "react-native-awesome-alerts";

const GroupDetailsCard = ({
  item,
  openEditSheet,
}: {
  item: GroupProps;
  openEditSheet: () => void;
}) => {
  if (!item) return null;

  const [showAlert, setShowAlert] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const deleteGroup = useMutation(api.suggestion.deleteGroup);

  const {
    groupName,
    role,
    status,
    _creationTime,
    suggestionsCount,
    approvedCount,
    rejectedCount,
  } = item;
  const isActive = status === "open";
  const creationTimeFormatted = formatDistanceToNowStrict(_creationTime, {
    addSuffix: true,
  });

  const handleDelete = async () => {
    if (deleting) return;
    setShowAlert(false);
    setDeleting(true);
    try {
      await deleteGroup({ groupId: item._id as Id<"groups"> });
      router.back();
    } catch (error) {
      console.error("Failed to delete group", error);
    } finally {
      setDeleting(false);
    }
  };
  const onPressDelete = () => {
    if (Platform.OS === "web") {
      setShowAlert(true);
    } else {
      Alert.alert(
        "Delete",
        "Are you sure you want to delete this suggestion? This action cannot be undone",
        [
          {
            text: "No, cancel",
            onPress: undefined,
            style: "cancel",
          },
          {
            text: "Yes, delete",
            onPress: () => handleDelete(),
            style: "destructive",
          },
        ]
      );
    }
  };

  return (
    <>
      <View style={styles.listHeaderContainer}>
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={require("@/assets/icons/avatar.png")}
              contentFit="contain"
              style={styles.groupLogo}
              transition={300}
            />
            <View>
              <Text style={styles.groupNameText}>{groupName}</Text>
              <Text
                style={[
                  styles.groupStatusText,
                  { color: isActive ? Colors.primary : Colors.error },
                ]}
              >
                {isActive ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>

          {role === "owner" && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={openEditSheet}
                style={styles.editButton}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="file-edit-outline"
                  size={24}
                  color={Colors.invited}
                />
              </TouchableOpacity>
              {deleting ? (
                <ActivityIndicator size="small" color={Colors.error} />
              ) : (
                <TouchableOpacity
                  onPress={onPressDelete}
                  style={styles.deleteButton}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="delete-forever-outline"
                    size={24}
                    color={Colors.error}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Role: </Text>
          <Text style={styles.detailValue}>{role}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created: </Text>
          <Text style={styles.detailValue}>{creationTimeFormatted}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Invitation Code: </Text>
          <Text style={styles.detailValue}>
            {item.invitationCode.substring(0, 15)}...
          </Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => Clipboard.setString(item.invitationCode)}
          >
            <FontAwesome5 name="copy" size={14} color={Colors.primary} />
          </TouchableOpacity>
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
                includeComma
              />
            </View>
          ))}
        </View>
      </View>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Delete"
        message="Are you sure you want to delete this group? This action cannot be undone"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton
        showConfirmButton
        cancelText="No, cancel"
        confirmText="Yes, delete"
        confirmButtonColor={Colors.error}
        onCancelPressed={() => setShowAlert(false)}
        onConfirmPressed={handleDelete}
      />
    </>
  );
};

export default GroupDetailsCard;
