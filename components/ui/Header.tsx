import React from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, LucideIcon } from 'lucide-react-native';
import { Colors } from '../../constants';
import { IconButton } from './IconButton';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  leftIcon?: LucideIcon;
  onLeftIconPress?: () => void;
  rightIcon?: LucideIcon;
  onRightIconPress?: () => void;
  rightIcon2?: LucideIcon;
  onRightIcon2Press?: () => void;
  rightContent?: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  leftIcon,
  onLeftIconPress,
  rightIcon,
  onRightIconPress,
  rightIcon2,
  onRightIcon2Press,
  rightContent,
  transparent = false,
  className = '',
}: HeaderProps) {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const LeftIcon = leftIcon;

  return (
    <View
      className={`
        flex-row items-center justify-between px-5 py-4
        ${transparent ? '' : 'bg-white border-b border-neutral-100'}
        ${className}
      `}
    >
      {/* Left Section */}
      <View className="flex-row items-center flex-1">
        {showBack && (
          <IconButton
            icon={ChevronLeft}
            onPress={handleBack}
            variant="default"
            size="md"
            className="mr-3"
            iconColor={Colors.primary}
            accessibilityLabel="Voltar"
            accessibilityHint="Toque duas vezes para voltar à tela anterior"
          />
        )}

        {LeftIcon && !showBack && (
          <IconButton
            icon={LeftIcon}
            onPress={onLeftIconPress}
            variant="default"
            size="md"
            className="mr-3"
            accessibilityLabel="Menu"
          />
        )}

        {(title || subtitle) && (
          <View className="flex-1" accessible={true} accessibilityRole="header" accessibilityLabel={`${title}${subtitle ? `. ${subtitle}` : ''}`}>
            {title && (
              <Text className="text-xl font-bold text-black" numberOfLines={1} accessibilityElementsHidden={true}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text className="text-sm text-neutral-500" numberOfLines={1} accessibilityElementsHidden={true}>
                {subtitle}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Right Section */}
      <View className="flex-row items-center">
        {rightContent}

        {rightIcon2 && (
          <IconButton
            icon={rightIcon2}
            onPress={onRightIcon2Press}
            variant="default"
            size="md"
            className="mr-2"
          />
        )}

        {rightIcon && (
          <IconButton
            icon={rightIcon}
            onPress={onRightIconPress}
            variant="default"
            size="md"
          />
        )}
      </View>
    </View>
  );
}

// Simple header with just back button
export interface SimpleHeaderProps {
  onBack?: () => void;
  rightContent?: React.ReactNode;
  transparent?: boolean;
}

export function SimpleHeader({
  onBack,
  rightContent,
  transparent = false,
}: SimpleHeaderProps) {
  return (
    <View
      className={`
        flex-row items-center justify-between px-5 py-4
        ${transparent ? '' : 'bg-white'}
      `}
    >
      <IconButton
        icon={ChevronLeft}
        onPress={onBack || (() => router.back())}
        variant="default"
        size="md"
        iconColor={Colors.primary}
        accessibilityLabel="Voltar"
        accessibilityHint="Toque duas vezes para voltar à tela anterior"
      />
      {rightContent}
    </View>
  );
}
