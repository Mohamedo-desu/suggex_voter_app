import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import Suggestion from "@/components/Suggestion";
import SuggestionGroup from "@/components/SuggestionGroup";
import Colors from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import styles from "@/styles/search.styles";
import { GroupProps, SuggestionProps } from "@/types";
import { debounce } from "@/utils/functions";

const SearchScreen: React.FC = () => {
  const [result, setResult] = useState<GroupProps | SuggestionProps | null>(
    null
  );
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [joining, setJoining] = useState(false);
  const [resultType, setResultType] = useState<string | null>(null);
  const { userId } = useAuth();

  const searchGroupsMutation = useMutation(
    api.suggestion.searchGroupsByInvitationCode
  );
  const searchSuggestionsMutation = useMutation(
    api.suggestion.searchSuggestionsByInvitationCode
  );
  const requestGroupJoinMutation = useMutation(
    api.suggestion.requestToJoinGroup
  );
  const requestSuggestionJoinMutation = useMutation(
    api.suggestion.requestToJoinSuggestion
  );

  const handleSearch = useCallback(async () => {
    const trimmed = searchPhrase.trim();
    const isGroup = trimmed.startsWith("grp") && trimmed.endsWith("G0g");
    const isSuggestion = trimmed.startsWith("sug") && trimmed.endsWith("S0s");

    if (trimmed && (isGroup || isSuggestion)) {
      setLoading(true);
      try {
        let res: any = null;
        if (isGroup) {
          res = await searchGroupsMutation({ invitationCode: trimmed });
          setResultType("group");
        } else {
          res = await searchSuggestionsMutation({ invitationCode: trimmed });
          setResultType("suggestion");
        }
        setResult(res || null);
      } catch (e) {
        console.error("Search failed: ", e);
        setResult(null);
      } finally {
        setLoading(false);
      }
    } else {
      setResult(null);
    }
  }, [searchPhrase, searchGroupsMutation, searchSuggestionsMutation]);

  const debouncedHandleSearch = useMemo(
    () => debounce(handleSearch, 500),
    [handleSearch]
  );

  const currentUser = useQuery(
    api.user.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  const handleRequestToJoin = async () => {
    if (!result || !userId || joining) return;
    try {
      setJoining(true);
      if (resultType === "group") {
        await requestGroupJoinMutation({
          invitationCode: (result as GroupProps).invitationCode,
        });
      } else if (resultType === "suggestion") {
        await requestSuggestionJoinMutation({
          invitationCode: (result as SuggestionProps).invitationCode,
        });
      }
      setSearchPhrase("");
      setResult(null);
      setResultType(null);
      router.back();
    } catch (err) {
      console.error("Request failed", err);
    } finally {
      setJoining(false);
    }
  };

  const handlePaste = async () => {
    const copiedText = await Clipboard.getString();

    console.log(copiedText);

    const isGroup = copiedText.startsWith("grp") && copiedText.endsWith("G0g");
    const isSuggestion =
      copiedText.startsWith("sug") && copiedText.endsWith("S0s");

    if (!isGroup && !isSuggestion) {
      alert("Please paste the correct invitation code");
      return;
    }

    setSearchPhrase(copiedText);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter invitation code"
            placeholderTextColor={Colors.placeholderText}
            value={searchPhrase}
            autoCapitalize="none"
            onChangeText={(text) => {
              setSearchPhrase(text);
              debouncedHandleSearch();
            }}
            autoFocus
          />
          {searchPhrase.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchPhrase("");
                setResult(null);
              }}
              style={styles.iconWrapper}
              activeOpacity={0.8}
            >
              <Ionicons
                name="close-circle"
                size={22}
                color={Colors.placeholderText}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleSearch}
            style={styles.iconWrapper}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <CustomButton
          text="paste from clipboard"
          onPress={handlePaste}
          style={styles.pasteButton}
        />
      </View>

      <View style={styles.resultsContainer}>
        {loading ? (
          <Loader />
        ) : result && userId ? (
          <>
            <Text style={styles.resultHeader}>Result</Text>
            {resultType === "group" ? (
              <SuggestionGroup item={result as GroupProps} userId={userId} />
            ) : (
              <Suggestion item={result as SuggestionProps} userId={userId} />
            )}

            {currentUser?._id !== result.userId && (
              <CustomButton
                text="Join"
                onPress={handleRequestToJoin}
                style={[
                  styles.pasteButton,
                  { backgroundColor: Colors.invited },
                ]}
                loading={joining}
              />
            )}
          </>
        ) : (
          <Empty text="No results" />
        )}
      </View>
    </View>
  );
};

export default SearchScreen;
