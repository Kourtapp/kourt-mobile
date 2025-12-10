import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { AppStateManager } from '../components/AppStateManager';
import '../global.css';

export default function RootLayout() {
  const { initialize, isInitialized, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading screen while initializing auth
  if (!isInitialized || isLoading) {
    return (
      <SafeAreaProvider>
        <LoadingScreen message="Carregando..." />
      </SafeAreaProvider>
    );
  }

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary>
          <AppStateManager>
            <SafeAreaProvider>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                  contentStyle: { backgroundColor: '#FAFAFA' },
                }}
              >
                {/* Auth screens */}
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />

                {/* Main tabs */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                {/* Modal screens */}
                <Stack.Screen
                  name="court/[id]"
                  options={{
                    presentation: 'card',
                    animation: 'slide_from_bottom',
                  }}
                />
                <Stack.Screen
                  name="booking/checkout"
                  options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                  }}
                />
                <Stack.Screen
                  name="booking/payment-method"
                  options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                  }}
                />
                <Stack.Screen
                  name="booking/confirmed"
                  options={{
                    presentation: 'fullScreenModal',
                    animation: 'fade',
                  }}
                />

                {/* Other screens */}
                <Stack.Screen name="messages" />
                <Stack.Screen name="chat/[id]" />
                <Stack.Screen name="notifications" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="ranking" />
                <Stack.Screen name="user/[id]" />
                <Stack.Screen name="booking/[id]" />
              </Stack>
            </SafeAreaProvider>
          </AppStateManager>
        </ErrorBoundary>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
