import React from 'react';
import { View, Pressable } from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const variantStyles = {
    default: 'bg-white',
    elevated: 'bg-white shadow-md',
    outlined: 'bg-white border border-neutral-200',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <View
      className={`
        rounded-2xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </View>
  );
}

// Pressable Card variant
export interface PressableCardProps extends CardProps {
  onPress?: () => void;
  disabled?: boolean;
}

export function PressableCard({
  children,
  onPress,
  disabled = false,
  className = '',
  variant = 'default',
  padding = 'md',
}: PressableCardProps) {
  const variantStyles = {
    default: 'bg-white',
    elevated: 'bg-white shadow-md',
    outlined: 'bg-white border border-neutral-200',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`
        rounded-2xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
      style={({ pressed }) => ({
        opacity: pressed && !disabled ? 0.9 : 1,
        transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
      })}
    >
      {children}
    </Pressable>
  );
}

// Card Header
export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <View className={`border-b border-neutral-100 pb-3 mb-3 ${className}`}>
      {children}
    </View>
  );
}

// Card Footer
export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <View className={`border-t border-neutral-100 pt-3 mt-3 ${className}`}>
      {children}
    </View>
  );
}
