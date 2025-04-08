import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import { createValidationSchema } from "@/utils/validation";
import { Picker } from "@react-native-picker/picker";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const CreateScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupStatus, setNewGroupStatus] = useState<"open" | "closed">(
    "open"
  );
  const [addingNewGroup, setAddingNewGroup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const addGroup = useMutation(api.suggestion.addGroup);
  const addSuggestion = useMutation(api.suggestion.addSuggestion);
  const groups = useQuery(api.suggestion.fetchUserGroups) || [];
  const { width } = useWindowDimensions();
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
        setModalVisible(false);
      }
    } catch (error) {
      console.log("error in creating group", error);
    } finally {
      setAddingNewGroup(false);
    }
  };

  const getModalContentStyle = () => {
    if (width < 640) return { paddingHorizontal: 15 };
    if (width < 1024) return { paddingHorizontal: 200 };
    return { paddingHorizontal: 300 };
  };

  return (
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
                  onPress={() => setModalVisible(true)}
                />
                <TouchableOpacity
                  style={{ gap: 10, opacity: values.group === null ? 0.3 : 1 }}
                  activeOpacity={1}
                  disabled={values.group === null}
                >
                  <Text style={styles.sectionTitle}>Suggestion Details</Text>
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
              </>
            )}
          </Formik>
          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={[styles.modalContainer, getModalContentStyle()]}>
              <View style={styles.modalContent}>
                <CustomInput
                  value={newGroupName}
                  placeholder="New Group Name"
                  handleChange={setNewGroupName}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newGroupStatus}
                    onValueChange={(itemValue) => setNewGroupStatus(itemValue)}
                  >
                    <Picker.Item label="open" value="open" />
                    <Picker.Item label="Approved" value="approved" />
                    <Picker.Item label="Rejected" value="rejected" />
                    <Picker.Item label="Closed" value="closed" />
                  </Picker>
                </View>
                <CustomButton
                  text="Add Group"
                  onPress={handleAddGroup}
                  loading={addingNewGroup}
                />
                <CustomButton
                  text="Cancel"
                  onPress={() => setModalVisible(false)}
                  style={{ backgroundColor: Colors.textSecondary }}
                />
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingHorizontal: Platform.OS === "web" ? 60 : 15,
    paddingVertical: 15,
    gap: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.Bold,
    color: Colors.textDark,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    overflow: "hidden",
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "web" ? 15 : 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: Colors.background,
    padding: 20,
    borderRadius: 8,
    gap: 10,
    alignSelf: "center",
    width: "100%",
  },
});
