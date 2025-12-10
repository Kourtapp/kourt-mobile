import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Colors } from '../../constants';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-20 px-10">
      <View className="w-20 h-20 bg-neutral-100 rounded-full items-center justify-center mb-4">
        <Icon size={40} color={Colors.neutral[400]} />
      </View>
      <Text className="text-lg font-semibold text-neutral-700 text-center">
        {title}
      </Text>
      {description && (
        <Text className="text-neutral-500 text-center mt-2">{description}</Text>
      )}
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className="bg-black px-6 py-3 rounded-xl mt-6"
        >
          <Text className="text-white font-semibold">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
