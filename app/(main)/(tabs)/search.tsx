import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import Suggestion from "@/components/Suggestion";
import SuggestionGroup from "@/components/SuggestionGroup";
import Colors from "@/constants/colors";
import { Fonts } from "@/constants/Fonts";
import { api } from "@/convex/_generated/api";
import { debounce } from "@/utils/functions";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import React, { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Define type for search mode.
type SearchType = "group" | "suggestion";

// Define types for Group and Suggestion search items.
interface GroupItem {
  _id: string;
  groupName: string;
  invitationCode: string;
  userId: string;
}

interface SuggestionItem {
  _id: string;
  title: string;
  invitationCode: string;
}

// Union type for a search item.
type SearchItemType = GroupItem | SuggestionItem;

// Props for the RenderItem component.
interface RenderItemProps {
  item: SearchItemType;
}

const SearchScreen: React.FC = () => {
  const [result, setResult] = useState<SearchItemType | null>(null);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resultType, setResultType] = useState<string | null>(null);

  const { user } = useUser();

  const searchGroupsMutation = useMutation(
    api.suggestion.searchGroupsByInvitationCode
  );
  const searchSuggestionsMutation = useMutation(
    api.suggestion.searchSuggestionsByInvitationCode
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
  }, [
    searchPhrase,
    searchGroupsMutation,
    searchSuggestionsMutation,
    resultType,
  ]);

  const debouncedHandleSearch = useMemo(
    () => debounce(handleSearch, 500),
    [handleSearch]
  );

  const currentUser = useQuery(
    api.user.getUserByClerkId,
    user?.id ? { clerkId: user?.id } : "skip"
  );

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
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {loading ? (
          <Loader />
        ) : result && user ? (
          <>
            <Text style={styles.resultHeader}>Result</Text>

            {resultType === "group" ? (
              <SuggestionGroup item={result} />
            ) : (
              <Suggestion item={result} userId={user.id} />
            )}
            {currentUser?._id !== result.userId && (
              <View style={styles.footerContainer}>
                <TouchableOpacity style={styles.joinButton} activeOpacity={0.8}>
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
});
