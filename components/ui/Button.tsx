import React from 'react';
import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const baseStyles = 'flex-row items-center justify-center rounded-xl';

  const variantStyles = {
    primary: 'bg-black',
    secondary: 'bg-neutral-100',
    outline: 'bg-transparent border border-neutral-300',
    ghost: 'bg-transparent',
    danger: 'bg-red-500',
  };

  const disabledStyles = {
    primary: 'bg-neutral-300',
    secondary: 'bg-neutral-50',
    outline: 'bg-transparent border-neutral-200',
    ghost: 'bg-transparent',
    danger: 'bg-red-300',
  };

  const textVariantStyles = {
    primary: 'text-white',
    secondary: 'text-black',
    outline: 'text-black',
    ghost: 'text-black',
    danger: 'text-white',
  };

  const disabledTextStyles = {
    primary: 'text-neutral-500',
    secondary: 'text-neutral-400',
    outline: 'text-neutral-400',
    ghost: 'text-neutral-400',
    danger: 'text-red-200',
  };

  const sizeStyles = {
    sm: 'px-3 py-2',
    md: 'px-5 py-3',
    lg: 'px-6 py-4',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const getIconColor = () => {
    if (isDisabled) {
      return variant === 'primary' || variant === 'danger' ? '#9CA3AF' : '#9CA3AF';
    }
    return variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#000000';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`
        ${baseStyles}
        ${isDisabled ? disabledStyles[variant] : variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={({ pressed }) => ({
        opacity: pressed && !isDisabled ? 0.8 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#000000'}
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <View className="mr-2">
              <Icon size={iconSizes[size]} color={getIconColor()} />
            </View>
          )}
          <Text
            className={`
              font-semibold
              ${textSizeStyles[size]}
              ${isDisabled ? disabledTextStyles[variant] : textVariantStyles[variant]}
            `}
          >
            {children}
          </Text>
          {Icon && iconPosition === 'right' && (
            <View className="ml-2">
              <Icon size={iconSizes[size]} color={getIconColor()} />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}
