import { useAuth } from '@clerk/clerk-expo';
import { Picker } from '@react-native-picker/picker';
import { useMutation, useQuery } from 'convex/react';
import { router, useLocalSearchParams } from 'expo-router';
import { nanoid } from 'nanoid/non-secure';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { GroupProps } from '@/types';

const EditGroup = () => {
  const { groupId } = useLocalSearchParams();

  const [editing, setEditing] = useState(false);

  const { userId } = useAuth();
  const currentUser = useQuery(api.user.getUserByClerkId, userId ? { clerkId: userId } : 'skip');

  const groupDetails = useQuery(api.suggestion.fetchGroupDetails, {
    groupId: groupId as Id<'groups'>,
  }) as GroupProps;

  // State for group editing and image selection
  const [editedGroup, setEditedGroup] = useState({
    groupName: groupDetails?.groupName || '',
    invitationCode: groupDetails?.invitationCode || '',
    status: groupDetails?.status || 'open',
  });

  const editGroup = useMutation(api.suggestion.editGroup);

  const generateNewInvitation = () => {
    const invitationCode = `grp${nanoid(5)}${currentUser?._id}${nanoid(5)}G0g`;
    setEditedGroup(prev => ({ ...prev, invitationCode }));
  };

  // Save group profile changes
  const handleSaveProfile = async () => {
    try {
      if (editing) return;
      setEditing(true);

      await editGroup({
        groupId: groupId as Id<'groups'>,
        groupName: editedGroup.groupName,
        invitationCode: editedGroup.invitationCode,
        status: editedGroup.status,
      });
      router.back();
    } catch (error) {
      console.error('Error updating profile', error);
    } finally {
      setEditing(false);
    }
  };

  useEffect(() => {
    setEditedGroup({
      groupName: groupDetails?.groupName,
      invitationCode: groupDetails?.invitationCode,
      status: groupDetails?.status,
    });
  }, [groupDetails]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Group Name</Text>
        <CustomInput
          placeholder="group name"
          value={editedGroup.groupName}
          handleChange={text => setEditedGroup(prev => ({ ...prev, groupName: text }))}
          maxLength={40}
          numberOfLines={1}
          placeholderTextColor={Colors.placeholderText}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={editedGroup.status}
            onValueChange={itemValue => setEditedGroup(prev => ({ ...prev, status: itemValue }))}
          >
            <Picker.Item label="open" value="open" style={styles.inputLabel} />
            <Picker.Item label="closed" value="closed" style={styles.inputLabel} />
          </Picker>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.invitationRow}>
          <Text style={styles.inputLabel}>Invitation Code</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={generateNewInvitation}>
            <Text style={[styles.inputLabel, { color: Colors.primary }]}>Generate New</Text>
          </TouchableOpacity>
        </View>
        <CustomInput
          placeholder="Invitation Code"
          style={{ height: 40 }}
          value={editedGroup.invitationCode}
          handleChange={text => setEditedGroup(prev => ({ ...prev, invitationCode: text }))}
          placeholderTextColor={Colors.placeholderText}
          editable={false}
          textAlignVertical="top"
          multiline
        />
      </View>
      <CustomButton text="Save Changes" onPress={handleSaveProfile} loading={editing} />
    </View>
  );
};

export default EditGroup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    padding: 15,
  },
  input: {
    backgroundColor: Colors.lightGray[200],
    borderRadius: 8,
    color: Colors.textDark,
    fontSize: 16,
    padding: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: Colors.textDark,
    fontFamily: Fonts.Regular,
    fontSize: 12,
  },
  invitationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.border,
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'web' ? 15 : 0,
  },
});
