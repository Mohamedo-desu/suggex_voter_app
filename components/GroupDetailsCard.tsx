import Colors from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import styles from "@/styles/groupDetailsCard.styles";
import { GroupProps } from "@/types";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
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

interface GroupDetailsCardProps {
  item: GroupProps;
  openImagePickerSheet: () => void;
}

const GroupDetailsCard = ({
  item,
  openImagePickerSheet,
}: GroupDetailsCardProps) => {
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
    imageUrl,
    invitationCode,
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
          { text: "No, cancel", onPress: undefined, style: "cancel" },
          { text: "Yes, delete", onPress: handleDelete, style: "destructive" },
        ]
      );
    }
  };

  const imageSource = imageUrl
    ? imageUrl
    : require("@/assets/icons/avatar.png");

  return (
    <>
      <View style={styles.listHeaderContainer}>
        <View style={styles.headerContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={openImagePickerSheet}
              style={styles.imageContainer}
              activeOpacity={0.8}
            >
              <Image
                source={
                  typeof imageSource === "string"
                    ? { uri: imageSource }
                    : imageSource
                }
                contentFit="contain"
                style={styles.groupLogo}
                transition={300}
              />
              {/* Overlay icon to indicate tap-to-change */}
              <View style={styles.cameraOverlay}>
                <Ionicons name="camera" size={16} color={Colors.white} />
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.groupNameText} numberOfLines={2}>
                {groupName}
              </Text>
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
                onPress={() =>
                  router.navigate({
                    pathname: "/(main)/editGroup",
                    params: {
                      groupId: item._id,
                    },
                  })
                }
                style={styles.editButton}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="file-edit-outline"
                  size={24}
                  color={Colors.primary}
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
            {invitationCode.substring(0, 15)}...
          </Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => Clipboard.setString(invitationCode)}
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
