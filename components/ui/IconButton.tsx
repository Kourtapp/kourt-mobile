import React from 'react';
import { Pressable, ActivityIndicator } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Colors } from '../../constants';

export interface IconButtonProps {
  icon: LucideIcon;
  onPress?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  iconColor?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export function IconButton({
  icon: Icon,
  onPress,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  iconColor,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: IconButtonProps) {
  const isDisabled = disabled || loading;

  const variantStyles = {
    default: 'bg-neutral-100',
    primary: 'bg-black',
    secondary: 'bg-white border border-neutral-200',
    ghost: 'bg-transparent',
    danger: 'bg-red-500',
  };

  const disabledStyles = {
    default: 'bg-neutral-50',
    primary: 'bg-neutral-300',
    secondary: 'bg-neutral-50 border-neutral-100',
    ghost: 'bg-transparent',
    danger: 'bg-red-300',
  };

  const sizeStyles = {
    sm: 'w-11 h-11', // Minimum 44pt touch target
    md: 'w-11 h-11', // Minimum 44pt touch target
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const getIconColor = () => {
    if (iconColor) return iconColor;
    if (isDisabled) return Colors.neutral[400];

    switch (variant) {
      case 'primary':
      case 'danger':
        return '#FFFFFF';
      default:
        return Colors.neutral[700];
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={loading ? 'Carregando' : accessibilityLabel || 'Botão'}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      className={`
        rounded-full items-center justify-center
        ${isDisabled ? disabledStyles[variant] : variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      style={({ pressed }) => ({
        opacity: pressed && !isDisabled ? 0.7 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : Colors.neutral[600]}
          accessibilityLabel="Carregando"
        />
      ) : (
        <Icon size={iconSizes[size]} color={getIconColor()} accessibilityElementsHidden={true} />
      )}
    </Pressable>
  );
}
