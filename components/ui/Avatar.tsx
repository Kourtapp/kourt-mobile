import React from 'react';
import { View, Text, Image } from 'react-native';
import { User } from 'lucide-react-native';

export interface AvatarProps {
  src?: string | null;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showOnline?: boolean;
  online?: boolean;
}

const sizeStyles = {
  xs: { container: 'w-6 h-6', text: 'text-xs', icon: 12, online: 'w-2 h-2' },
  sm: { container: 'w-8 h-8', text: 'text-xs', icon: 14, online: 'w-2.5 h-2.5' },
  md: { container: 'w-10 h-10', text: 'text-sm', icon: 16, online: 'w-3 h-3' },
  lg: { container: 'w-12 h-12', text: 'text-base', icon: 20, online: 'w-3.5 h-3.5' },
  xl: { container: 'w-16 h-16', text: 'text-lg', icon: 24, online: 'w-4 h-4' },
  '2xl': { container: 'w-24 h-24', text: 'text-2xl', icon: 32, online: 'w-5 h-5' },
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getColorFromName = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

export function Avatar({
  src,
  fallback,
  size = 'md',
  className = '',
  showOnline = false,
  online = false,
}: AvatarProps) {
  const styles = sizeStyles[size];
  const hasImage = src && src.length > 0;
  const displayFallback = fallback || 'U';
  const bgColor = getColorFromName(displayFallback);

  // Generate accessibility label
  const getAccessibilityLabel = (): string => {
    const userName = fallback || 'Usuário';
    const onlineStatus = showOnline ? (online ? ', online' : ', offline') : '';
    return `Avatar de ${userName}${onlineStatus}`;
  };

  return (
    <View
      className={`relative ${className}`}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={getAccessibilityLabel()}
    >
      {hasImage ? (
        <Image
          source={{ uri: src }}
          className={`${styles.container} rounded-full`}
          resizeMode="cover"
          accessible={true}
          accessibilityLabel={getAccessibilityLabel()}
        />
      ) : (
        <View
          className={`${styles.container} ${bgColor} rounded-full items-center justify-center`}
          accessible={false}
        >
          {fallback ? (
            <Text className={`${styles.text} font-semibold text-white`} accessibilityElementsHidden={true}>
              {getInitials(displayFallback)}
            </Text>
          ) : (
            <User size={styles.icon} color="#FFFFFF" accessibilityElementsHidden={true} />
          )}
        </View>
      )}

      {showOnline && (
        <View
          className={`absolute bottom-0 right-0 ${styles.online} rounded-full border-2 border-white ${
            online ? 'bg-green-500' : 'bg-neutral-300'
          }`}
          accessible={true}
          accessibilityLabel={online ? 'Online' : 'Offline'}
          accessibilityRole="text"
        />
      )}
    </View>
  );
}
