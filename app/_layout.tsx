import * as Sentry from '@sentry/react-native';
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useAuthStore } from '../stores/authStore';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { AppStateManager } from '../components/AppStateManager';
import { ConsentBanner } from '../components/ConsentBanner';
import { useConsent } from '../hooks/useConsent';
import { Analytics } from '../services/analyticsService';
import { logger } from '../utils/logger';
import '../global.css';

// Initialize Sentry for error tracking
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
  environment: __DEV__ ? 'development' : 'production',
  enableAutoPerformanceTracing: true,
  tracesSampleRate: 1.0,
  debug: __DEV__,
  // Don't send errors in development
  enabled: !__DEV__,
});

// Initialize QueryClient outside to ensure stability
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function RootLayout() {
  logger.debug('[RootLayout] Rendering');

  const { initialize, isInitialized, isLoading, user } = useAuthStore();
  const { hasCompletedOnboarding, loading: consentLoading } = useConsent();
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  useEffect(() => {
    initialize();
    Analytics.log('app_open');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show consent banner if user is logged in and hasn't completed consent onboarding
  useEffect(() => {
    if (isInitialized && !consentLoading && user && !hasCompletedOnboarding) {
      // Delay showing banner to ensure smooth app initialization
      const timer = setTimeout(() => {
        setShowConsentBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, consentLoading, user, hasCompletedOnboarding]);

  // Show loading screen while initializing auth
  if (!isInitialized || isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <LoadingScreen message="Carregando..." />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <ErrorBoundary>
            <AppStateManager>
              <SafeAreaProvider>
                <StatusBar style="dark" />
                <OfflineIndicator position="top" />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    contentStyle: { backgroundColor: '#FAFAFA' },
                  }}
                >
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

                  {/* Menu+ Modal (Bottom Sheet) */}
                  <Stack.Screen
                    name="plus-modal"
                    options={{
                      presentation: 'transparentModal',
                      animation: 'fade',
                      headerShown: false,
                      contentStyle: { backgroundColor: 'transparent' },
                    }}
                  />

                  {/* Other screens */}
                  <Stack.Screen name="messages" />
                  <Stack.Screen name="chat/[id]" />
                  <Stack.Screen name="notifications" />
                  <Stack.Screen name="settings" />
                  <Stack.Screen name="settings/privacy-settings" />
                  <Stack.Screen name="ranking" />
                  <Stack.Screen name="user/[id]" />
                  <Stack.Screen name="booking/[id]" />
                  <Stack.Screen name="match/[id]" options={{ headerShown: false }} />
                  <Stack.Screen name="match/create" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="match/invite" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="match/live" options={{ headerShown: false }} />

                  {/* Onboarding */}
                  <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
                </Stack>

                {/* LGPD Consent Banner */}
                <ConsentBanner
                  visible={showConsentBanner}
                  onClose={() => setShowConsentBanner(false)}
                />
              </SafeAreaProvider>
            </AppStateManager>
          </ErrorBoundary>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
