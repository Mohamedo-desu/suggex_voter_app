import Colors from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import styles from "@/styles/groupDetailsCard.styles";
import { GroupProps } from "@/types";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Clipboard from "@react-native-clipboard/clipboard";
import { Picker } from "@react-native-picker/picker";
import { useMutation } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import { router } from "expo-router";
import { nanoid } from "nanoid/non-secure";
import React, { useMemo, useRef, useState } from "react";
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
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";

const GroupDetailsCard = ({
  item,
  userId,
}: {
  item: GroupProps;
  userId: string;
}) => {
  if (!item) return null;

  const [showAlert, setShowAlert] = useState(false);

  const [editedGroup, setEditedGroup] = useState({
    groupName: item.groupName || "",
    invitationCode: item.invitationCode || "",
    status: item.status || "open",
  });
  const [deleting, setDeleting] = useState(false);

  const deleteGroup = useMutation(api.suggestion.deleteGroup);
  const editGroup = useMutation(api.suggestion.editGroup);

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
  const handleSaveProfile = async () => {
    try {
      await editGroup({
        groupId: item._id as Id<"groups">,
        groupName: editedGroup.groupName,
        invitationCode: editedGroup.invitationCode,
        status: editedGroup.status,
      });
    } catch (error) {
      console.error("Error updating profile", error);
    } finally {
      bottomSheetRef.current?.close();
    }
  };

  const generateNewInvitation = () => {
    const invitationCode = `grp${nanoid(5)}${userId}${nanoid(5)}G0g`;
    setEditedGroup((prev) => ({ ...prev, invitationCode }));
  };

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const openEditSheet = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };
  const closeEditSheet = () => {
    bottomSheetRef.current?.close();
    setEditedGroup({
      groupName: item.groupName,
      invitationCode: item.invitationCode,
      status: item.status,
    });
  };

  return (
    <>
      <View style={styles.listHeaderContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.leftHeader}>
            <Text style={styles.groupNameText}>{groupName}</Text>
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
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            onPress={closeEditSheet}
          />
        )}
        handleIndicatorStyle={{ backgroundColor: Colors.primary }}
      >
        <BottomSheetView>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Group</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.invitationRow}>
                <Text style={styles.inputLabel}>Group Name</Text>
              </View>

              <CustomInput
                placeholder="group name"
                value={editedGroup.groupName}
                handleChange={(text) =>
                  setEditedGroup((prev) => ({ ...prev, groupName: text }))
                }
                placeholderTextColor={Colors.placeholderText}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.invitationRow}>
                <Text style={styles.inputLabel}>Status</Text>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editedGroup.status}
                  onValueChange={(itemValue) =>
                    setEditedGroup((prev) => ({
                      ...prev,
                      status: itemValue,
                    }))
                  }
                >
                  <Picker.Item
                    label="open"
                    value="open"
                    style={styles.inputLabel}
                  />
                  <Picker.Item
                    label="closed"
                    value="closed"
                    style={styles.inputLabel}
                  />
                </Picker>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.invitationRow}>
                <Text style={styles.inputLabel}>Invitation Code</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={generateNewInvitation}
                >
                  <Text style={[styles.inputLabel, { color: Colors.primary }]}>
                    Generate New
                  </Text>
                </TouchableOpacity>
              </View>

              <CustomInput
                placeholder="Invitation Code"
                style={[{ height: 40 }]}
                value={editedGroup.invitationCode}
                handleChange={(text) =>
                  setEditedGroup((prev) => ({
                    ...prev,
                    invitationCode: text,
                  }))
                }
                placeholderTextColor={Colors.placeholderText}
                editable={false}
                textAlignVertical="top"
                multiline
              />
            </View>
            <CustomButton text="Save Changes" onPress={handleSaveProfile} />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default GroupDetailsCard;
