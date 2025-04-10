import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import Suggestion from "@/components/Suggestion";
import SuggestionGroup from "@/components/SuggestionGroup";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import { GroupProps, SuggestionProps } from "@/types";
import { debounce } from "@/utils/functions";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SearchScreen: React.FC = () => {
  const [result, setResult] = useState<GroupProps | SuggestionProps | null>(
    null
  );
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resultType, setResultType] = useState<string | null>(null);

  const { userId } = useAuth();

  // Existing mutations for searching
  const searchGroupsMutation = useMutation(
    api.suggestion.searchGroupsByInvitationCode
  );
  const searchSuggestionsMutation = useMutation(
    api.suggestion.searchSuggestionsByInvitationCode
  );

  // New mutations for requesting to join
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

  // Handler for join button press
  const handleRequestToJoin = async () => {
    if (!result || !userId) return;
    try {
      // Use the invitationCode from the result record
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
    }
  };

  useEffect(() => {
    const getCopiedText = async () => {
      try {
        const copiedText = await Clipboard.getString();

        console.log("Clipboard content:", copiedText);

        if (!copiedText) return;

        const isGroup =
          copiedText.startsWith("grp") && copiedText.endsWith("G0g");
        const isSuggestion =
          copiedText.startsWith("sug") && copiedText.endsWith("S0s");

        if (!isGroup || !isSuggestion) {
          return;
        }
        setSearchPhrase(copiedText);
      } catch (error) {
        console.log("Failed to get clipboard content:", error);
      }
    };
    getCopiedText();
  }, []);

  return (
    <View style={styles.container}>
      {/* Search Input */}
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
              <Ionicons name="close-circle" size={22} color={Colors.error} />
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
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
            borderRadius: 5,
          }}
          activeOpacity={0.8}
          onPress={() => Clipboard.getString().then(setSearchPhrase)}
        >
          <Text
            style={{
              color: Colors.white,
              fontSize: 14,
              fontFamily: Fonts.Regular,
            }}
          >
            paste from clipboard
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
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
            {/* Show join button only if the current user is not the owner */}
            {currentUser?._id !== result.userId && (
              <View style={styles.footerContainer}>
                <TouchableOpacity
                  style={styles.joinButton}
                  activeOpacity={0.8}
                  onPress={handleRequestToJoin}
                >
                  <Text style={styles.joinButtonText}>Request To Join</Text>
                </TouchableOpacity>
              </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightGray[300],
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textDark,
    paddingVertical: 10,
  },
  iconWrapper: {
    padding: 5,
  },
  resultsContainer: {
    flex: 1,
    padding: 15,
  },
  resultHeader: {
    fontSize: 20,
    color: Colors.textDark,
    fontFamily: Fonts.Bold,
    marginBottom: 5,
  },
  footerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  joinButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 5,
    width: "100%",
    padding: 15,
  },
  joinButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.Medium,
  },
  pasteButton: {
    marginTop: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  pasteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
