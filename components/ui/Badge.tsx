import React from 'react';
import { View, Text } from 'react-native';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-neutral-100',
    primary: 'bg-black',
    secondary: 'bg-neutral-200',
    success: 'bg-green-100',
    warning: 'bg-amber-100',
    error: 'bg-red-100',
    outline: 'bg-transparent border border-neutral-300',
  };

  const textVariantStyles = {
    default: 'text-neutral-700',
    primary: 'text-white',
    secondary: 'text-neutral-600',
    success: 'text-green-700',
    warning: 'text-amber-700',
    error: 'text-red-700',
    outline: 'text-neutral-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5',
    md: 'px-2.5 py-1',
    lg: 'px-3 py-1.5',
  };

  const textSizeStyles = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <View
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={typeof children === 'string' ? children : 'Badge'}
      className={`
        rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      <Text
        className={`
          font-medium
          ${textVariantStyles[variant]}
          ${textSizeStyles[size]}
        `}
      >
        {children}
      </Text>
    </View>
  );
}

// Notification badge (for icons)
export interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
}

export function NotificationBadge({
  count,
  max = 99,
  className = '',
}: NotificationBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <View
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${count} notificações não lidas`}
      className={`
        absolute -top-1 -right-1
        min-w-5 h-5 px-1
        bg-red-500 rounded-full
        items-center justify-center
        ${className}
      `}
    >
      <Text className="text-white text-xs font-bold">{displayCount}</Text>
    </View>
  );
}
