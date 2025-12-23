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
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint describing what happens when pressed */
  accessibilityHint?: string;
  /** Test ID for testing */
  testID?: string;
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
  accessibilityLabel,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Generate accessibility label from children if not provided
  const getAccessibilityLabel = (): string => {
    if (accessibilityLabel) return accessibilityLabel;
    if (typeof children === 'string') return children;
    return 'Button';
  };

  const baseStyles = 'flex-row items-center justify-center rounded-xl';

  const variantStyles = {
    primary: 'bg-[#1F2937]',
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
      return variant === 'primary' || variant === 'danger' ? '#6B7280' : '#6B7280';
    }
    return variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#000000';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={loading ? 'Carregando' : getAccessibilityLabel()}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      className={`
        ${baseStyles}
        ${isDisabled ? disabledStyles[variant] : variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={({ pressed }) => ({
        opacity: pressed && !isDisabled ? 0.8 : 1,
        minHeight: 44, // Minimum touch target size for accessibility
      })}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#000000'}
          accessibilityLabel="Carregando"
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <View className="mr-2" accessibilityElementsHidden={true}>
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
            <View className="ml-2" accessibilityElementsHidden={true}>
              <Icon size={iconSizes[size]} color={getIconColor()} />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}
