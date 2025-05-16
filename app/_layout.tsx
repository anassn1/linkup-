import { useEffect } from 'react';
import { Slot, Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  // CRITICAL: This hook must be preserved
  useFrameworkReady();
  
  const segments = useSegments();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium, 
    Inter_600SemiBold,
    Inter_700Bold
  });
  
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
  
  useEffect(() => {
    if (isLoading || !router || !fontsLoaded) return;
    
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    
    if (!user && !inAuthGroup) {
      // Redirect to login if user is not authenticated
      router.replace('/(auth)/login');
    } else if (user && !user.onboardingComplete && !inOnboardingGroup) {
      // Redirect to onboarding if user hasn't completed profile setup
      router.replace('/(onboarding)/profile-setup');
    } else if (
      (user && inAuthGroup) || 
      (user && user.onboardingComplete && inOnboardingGroup)
    ) {
      // Redirect to main app if user is authenticated and has completed onboarding
      router.replace('/tabs/');
    }
  }, [user, segments, isLoading, router, fontsLoaded]);
  
  // Show nothing while loading fonts or checking auth state
  if (!fontsLoaded || isLoading) {
    return null;
  }
  
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}