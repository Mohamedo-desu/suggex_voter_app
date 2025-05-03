import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, TouchableOpacity } from 'react-native';
import Animated, { Easing, LinearTransition } from 'react-native-reanimated';
import Empty from '@/components/Empty';
import Loader from '@/components/Loader';
import SuggestionGroup from '@/components/SuggestionGroup';
import Colors from '@/constants/Colors';
import { api } from '@/convex/_generated/api';
import { GroupProps } from '@/types';

const SuggestionsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const { signOut } = useAuth();

  const groups = useQuery(api.suggestion.fetchUserGroups) as GroupProps[];

  const { userId } = useAuth();

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const renderItem = ({ item, index }: { item: GroupProps; index: number }) => {
    if (!userId) return null;
    return <SuggestionGroup item={item} userId={userId} index={index} />;
  };
  const navigation = useNavigation();

  const handleLogOut = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'No, cancel',
        onPress: undefined,
        style: 'cancel',
      },
      {
        text: 'Yes, logout',
        onPress: () => signOut(),
        style: 'destructive',
      },
    ]);
  };
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 15 }}
          activeOpacity={0.8}
          hitSlop={10}
          onPress={handleLogOut}
        >
          <Ionicons name="log-out-outline" size={25} color={Colors.placeholderText} />
        </TouchableOpacity>
      ),
    });
  }, []);

  if (groups === undefined) {
    return <Loader />;
  }

  return (
    <Animated.FlatList
      data={groups}
      refreshControl={
        <RefreshControl
          onRefresh={onRefresh}
          refreshing={refreshing}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item._id}
      renderItem={renderItem}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 15,
        gap: 10,
        paddingBottom: 50,
      }}
      ListEmptyComponent={<Empty text="No suggestion groups found!" />}
      itemLayoutAnimation={LinearTransition.easing(Easing.ease).delay(100)}
    />
  );
};

export default SuggestionsScreen;
