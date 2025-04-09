import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import SuggestionGroup from "@/components/SuggestionGroup";
import Colors from "@/constants/colors";
import { api } from "@/convex/_generated/api";
import { GroupProps } from "@/types";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";

const ProfileScreen = () => {
  const { signOut, userId } = useAuth();

  const currentUser = useQuery(
    api.user.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  const groups = useQuery(api.suggestion.fetchUserGroups) as GroupProps[];

  const renderItem = ({ item }: { item: GroupProps }) => {
    return <SuggestionGroup item={item} userId={userId} />;
  };

  if (!currentUser) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{currentUser.username}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: currentUser.image }}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <AnimatedNumbers
                  includeComma
                  animationDuration={500}
                  animateToNumber={currentUser.suggestionsCount}
                  fontStyle={styles.statNumber}
                />
                <Text style={styles.statLabel}>Suggestions</Text>
              </View>
              <View style={styles.statItem}>
                <AnimatedNumbers
                  includeComma
                  animationDuration={500}
                  animateToNumber={currentUser.commentsCount}
                  fontStyle={styles.statNumber}
                />
                <Text style={styles.statLabel}>comments</Text>
              </View>
            </View>
          </View>
          <Text style={styles.name}>{currentUser.fullname}</Text>
        </View>
        <FlatList
          data={groups}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow: 1, padding: 15, gap: 10 }}
          ListEmptyComponent={<Empty text="No groups found" />}
        />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.cardBackground,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textDark,
  },
  headerRight: {
    flexDirection: "row",
    gap: 16,
  },
  headerIcon: {
    padding: 4,
  },
  profileInfo: {
    padding: 16,
  },
  avatarAndStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 32,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderColor: Colors.cardBackground,
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  statNumber: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textDark,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textDark,
    marginBottom: 4,
  },
});
