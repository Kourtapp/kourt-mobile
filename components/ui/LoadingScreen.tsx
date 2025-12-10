import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants';

export interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  transparent?: boolean;
}

export function LoadingScreen({
  message = 'Carregando...',
  fullScreen = true,
  transparent = false,
}: LoadingScreenProps) {
  return (
    <View
      className={`
        items-center justify-center
        ${fullScreen ? 'flex-1' : 'py-20'}
        ${transparent ? 'bg-transparent' : 'bg-white'}
      `}
    >
      <ActivityIndicator size="large" color={Colors.primary} />
      {message && (
        <Text className="mt-4 text-neutral-600 text-base">{message}</Text>
      )}
    </View>
  );
}

// Inline loading spinner
export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 'small',
  color = Colors.primary,
  className = '',
}: LoadingSpinnerProps) {
  return (
    <View className={`items-center justify-center ${className}`}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

// Loading overlay
export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-black/50 items-center justify-center z-50">
      <View className="bg-white rounded-2xl px-8 py-6 items-center">
        <ActivityIndicator size="large" color={Colors.primary} />
        {message && (
          <Text className="mt-3 text-neutral-700 text-base">{message}</Text>
        )}
      </View>
    </View>
  );
}

// Pull to refresh loading
export function RefreshLoading() {
  return (
    <View className="py-4 items-center">
      <ActivityIndicator size="small" color={Colors.neutral[400]} />
    </View>
  );
}

// Load more indicator
export interface LoadMoreProps {
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function LoadMoreIndicator({ loading, hasMore }: LoadMoreProps) {
  if (!hasMore) return null;

  return (
    <View className="py-4 items-center">
      {loading ? (
        <ActivityIndicator size="small" color={Colors.neutral[400]} />
      ) : (
        <Text className="text-neutral-400 text-sm">Carregar mais...</Text>
      )}
    </View>
  );
}
