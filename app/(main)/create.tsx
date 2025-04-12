import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import styles from "@/styles/create.styles";
import { createValidationSchema } from "@/utils/validation";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

const CreateScreen = () => {
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupStatus, setNewGroupStatus] = useState<"open" | "closed">(
    "open"
  );
  const [addingNewGroup, setAddingNewGroup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const addGroup = useMutation(api.suggestion.addGroup);
  const addSuggestion = useMutation(api.suggestion.addSuggestion);
  const groups = useQuery(api.suggestion.fetchUserGroups) || [];

  const router = useRouter();

  const handleSubmitForm = async (values: any, resetForm: any) => {
    try {
      setSubmitting(true);
      if (!values.group) {
        Alert.alert("Error", "Please select a group", [{ text: "OK" }]);
        setSubmitting(false);
        return;
      }
      await addSuggestion({
        groupId: values.group._id,
        suggestionTitle: values.suggestionTitle,
        suggestionDescription: values.suggestionDescription,
        endGoal: Number(values.endGoal),
        status: values.status,
      });
      resetForm();
      router.back();
    } catch (error) {
      console.log("error submitting suggestion ", error);
      ToastAndroid.show(
        "Submission failed. Please try again.",
        ToastAndroid.SHORT
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddGroup = async () => {
    try {
      setAddingNewGroup(true);
      if (newGroupName.trim()) {
        await addGroup({ groupName: newGroupName, status: newGroupStatus });
        setNewGroupName("");
        setNewGroupStatus("open");
      }
    } catch (error) {
      console.log("error in creating group", error);
    } finally {
      setAddingNewGroup(false);
      closeEditSheet();
    }
  };

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["80%"];

  const openEditSheet = () => {
    bottomSheetRef.current?.expand();
  };
  const closeEditSheet = () => {
    bottomSheetRef.current?.close();
    Keyboard.dismiss();
  };
  return (
    <>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Formik
              enableReinitialize
              initialValues={{
                group: groups[0] || null,
                suggestionTitle: "",
                suggestionDescription: "",
                endGoal: 100,
                status: "open",
              }}
              validationSchema={createValidationSchema}
              onSubmit={(values, { resetForm }) =>
                handleSubmitForm(values, resetForm)
              }
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <>
                  <Text style={styles.sectionTitle}>
                    Suggestion Group Details
                  </Text>
                  <View style={styles.pickerContainer}>
                    {groups.length > 0 ? (
                      <Picker
                        selectedValue={values.group?.groupName}
                        onValueChange={(itemValue) =>
                          setFieldValue("group", itemValue)
                        }
                      >
                        {groups.map((group) => (
                          <Picker.Item
                            key={group._id}
                            label={group.groupName}
                            value={group}
                          />
                        ))}
                      </Picker>
                    ) : (
                      <Picker enabled={false}>
                        <Picker.Item label="No groups available" value={null} />
                      </Picker>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      color: Colors.placeholderText,
                      fontFamily: Fonts.Regular,
                    }}
                  >
                    Note:double check the group name
                  </Text>
                  <CustomButton
                    text="Create New Group"
                    onPress={openEditSheet}
                  />
                  {values.group !== null && (
                    <TouchableOpacity
                      style={{
                        gap: 10,
                      }}
                      activeOpacity={1}
                    >
                      <Text style={styles.sectionTitle}>
                        Suggestion Details
                      </Text>
                      <CustomInput
                        value={values.suggestionTitle}
                        placeholder="Suggestion Title"
                        handleChange={handleChange("suggestionTitle")}
                        onBlur={handleBlur("suggestionTitle")}
                        errors={errors.suggestionTitle}
                        touched={touched.suggestionTitle}
                        autoCorrect={true}
                      />
                      <CustomInput
                        value={values.suggestionDescription}
                        placeholder="Suggestion Description"
                        handleChange={handleChange("suggestionDescription")}
                        onBlur={handleBlur("suggestionDescription")}
                        multiline
                        style={[styles.textArea]}
                        textAlignVertical="top"
                        maxLength={300}
                        errors={errors.suggestionDescription}
                        touched={touched.suggestionDescription}
                      />
                      <CustomInput
                        value={String(values.endGoal)}
                        placeholder="Final votes needed"
                        keyboardType="numeric"
                        handleChange={handleChange("endGoal")}
                        onBlur={handleBlur("endGoal")}
                        errors={errors.endGoal}
                        touched={touched.endGoal}
                      />
                      <View style={styles.pickerContainer}>
                        <Picker
                          selectedValue={values.status}
                          onValueChange={(itemValue) =>
                            setFieldValue("status", itemValue)
                          }
                        >
                          <Picker.Item label="open" value="open" />
                          <Picker.Item label="Approved" value="approved" />
                          <Picker.Item label="Rejected" value="rejected" />
                          <Picker.Item label="Closed" value="closed" />
                        </Picker>
                      </View>
                      <CustomButton
                        text="Submit"
                        onPress={() => handleSubmit()}
                        loading={submitting}
                      />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
      >
        <BottomSheetView>
          <View style={styles.modalContent}>
            <CustomInput
              value={newGroupName}
              placeholder="New Group Name"
              handleChange={setNewGroupName}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={40}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newGroupStatus}
                onValueChange={(itemValue) => setNewGroupStatus(itemValue)}
              >
                <Picker.Item label="open" value="open" />
                <Picker.Item label="Closed" value="closed" />
              </Picker>
            </View>
            <CustomButton
              text="Add Group"
              onPress={handleAddGroup}
              loading={addingNewGroup}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default CreateScreen;
