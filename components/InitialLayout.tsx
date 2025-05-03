import { useAuth } from '@clerk/clerk-expo';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import Loader from './Loader';

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthScreen = segments[0] === '(auth)';

    if (!isSignedIn && !inAuthScreen) {
      router.replace('/(auth)');
    } else if (isSignedIn && inAuthScreen) {
      router.replace('/(main)/(tabs)');
    }
  }, [isLoaded, isSignedIn, segments]);

  if (!isLoaded) return <Loader />;

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
};

export default InitialLayout;
