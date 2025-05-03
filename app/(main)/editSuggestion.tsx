import { Picker } from '@react-native-picker/picker';
import { useMutation, useQuery } from 'convex/react';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { nanoid } from 'nanoid/non-secure';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { SuggestionProps } from '@/types';
import { getMimeType } from '@/utils/mimeType';

const editSuggestion = () => {
  const { suggestionId } = useLocalSearchParams();
  const [editing, setEditing] = useState(false);

  const suggestionDetails = useQuery(api.suggestion.fetchSuggestionDetails, {
    suggestionId: suggestionId as Id<'suggestions'>,
  }) as SuggestionProps;

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [editedSuggestion, setEditedSuggestion] = useState({
    invitationCode: suggestionDetails?.invitationCode || '',
    status: suggestionDetails?.status || 'open',
    endGoal: suggestionDetails?.endGoal?.toString() || '',
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const editSuggestionMutation = useMutation(api.suggestion.editSuggestion);

  const handleSaveProfile = async () => {
    try {
      if (editing) return;
      setEditing(true);

      const storageId = await uploadImage(selectedImage || '');
      await editSuggestionMutation({
        suggestionId: suggestionId as Id<'suggestions'>,
        invitationCode: editedSuggestion.invitationCode,
        status: editedSuggestion.status,
        endGoal: parseInt(editedSuggestion.endGoal),
        storageId,
      });
      router.back();
    } catch (error) {
      console.error('Error updating profile', error);
    } finally {
      setEditing(false);
    }
  };

  const generateNewInvitation = () => {
    const invitationCode = `sug${nanoid(5)}${suggestionDetails?.groupId}${nanoid(5)}S0s`;
    setEditedSuggestion(prev => ({ ...prev, invitationCode }));
  };

  useEffect(() => {
    setEditedSuggestion({
      endGoal: suggestionDetails?.endGoal?.toString() || '',
      invitationCode: suggestionDetails?.invitationCode || '',
      status: suggestionDetails?.status || 'open',
    });
  }, [suggestionDetails]);

  const uploadImage = async (uri: string) => {
    try {
      if (!uri) return;

      // Convert the selected image URI to a Blob.
      const imageResponse = await fetch(uri);
      const imageBlob = await imageResponse.blob();

      // Generate the upload URL.
      const uploadUrl = await generateUploadUrl();

      // Upload the blob to the generated URL.
      const uploadResult = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': getMimeType(uri),
        },
        body: imageBlob,
      });

      // Check for a successful upload.
      if (uploadResult.status !== 200) {
        const errorText = await uploadResult.text();
        throw new Error('Image upload failed: ' + errorText);
      }

      // Parse the JSON response.
      const { storageId } = await uploadResult.json();

      return storageId;
    } catch (error) {
      console.error('Image upload failed', error);
      Alert.alert('Upload failed', 'Could not upload image, please try again.');
    }
  };

  // Handle launching the image library and selecting an image.
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert('Permission to access gallery is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking an image', error);
    }
  };

  // Determine the image to display
  const defaultImage = require('@/assets/icons/avatar.png');
  const imageSource = selectedImage
    ? selectedImage
    : suggestionDetails?.imageUrl
      ? suggestionDetails.imageUrl
      : defaultImage;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={[styles.inputContainer, { height: '30%', width: '100%' }]}
          onPress={pickImage}
          activeOpacity={0.8}
        >
          <Image
            source={imageSource}
            contentFit="cover"
            style={{ width: '100%', height: '100%' }}
          />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={editedSuggestion.status}
              onValueChange={itemValue =>
                setEditedSuggestion(prev => ({
                  ...prev,
                  status: itemValue,
                }))
              }
            >
              <Picker.Item label="open" value="open" style={styles.inputLabel} />
              <Picker.Item label="Approved" value="approved" style={styles.inputLabel} />
              <Picker.Item label="Rejected" value="rejected" style={styles.inputLabel} />
              <Picker.Item label="Closed" value="closed" style={styles.inputLabel} />
            </Picker>
          </View>
        </View>

        {suggestionDetails?.status === 'open' && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>End Goal for this Suggestion</Text>
            <CustomInput
              placeholder="group name"
              value={editedSuggestion.endGoal}
              handleChange={text =>
                setEditedSuggestion(prev => ({
                  ...prev,
                  endGoal: text,
                }))
              }
              placeholderTextColor={Colors.placeholderText}
            />
          </View>
        )}

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
            value={editedSuggestion.invitationCode}
            handleChange={text =>
              setEditedSuggestion(prev => ({
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

        <CustomButton text="Save Changes" onPress={handleSaveProfile} loading={editing} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default editSuggestion;

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
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
