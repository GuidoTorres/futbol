import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { useFrameworkReady } from '../hooks/useFrameworkReady.js';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import NavigationLoadingBar from '../components/NavigationLoadingBar';
import { useDeepLinking } from '../hooks/useDeepLinking';

export default function RootLayout() {
  useFrameworkReady();
  useDeepLinking(); // Handle deep links

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationLoadingBar />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          // Smooth screen transitions
          animation: 'slide_from_right',
          animationDuration: 250,
          // Gesture navigation
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          // Custom transition for iOS
          ...(Platform.OS === 'ios' && {
            presentation: 'card',
            animationTypeForReplace: 'push',
          }),
          // Custom transition for Android
          ...(Platform.OS === 'android' && {
            animationTypeForReplace: 'push',
          }),
        }}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            animation: 'none', // No animation for tab navigator
          }} 
        />
        {/* Detail screens with custom animations */}
        <Stack.Screen 
          name="match/[id]" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
          }} 
        />
        <Stack.Screen 
          name="team/[id]" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
          }} 
        />
        <Stack.Screen 
          name="player/[id]" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
          }} 
        />
        <Stack.Screen 
          name="league/[id]" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
          }} 
        />
        <Stack.Screen 
          name="comparison/index" 
          options={{ 
            animation: 'slide_from_bottom',
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }} 
        />
        <Stack.Screen 
          name="comparison/results" 
          options={{ 
            animation: 'slide_from_right',
            gestureEnabled: true,
          }} 
        />
      </Stack>
      <StatusBar style="light" />
    </View>
  );
}