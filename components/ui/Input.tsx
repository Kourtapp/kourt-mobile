import React, { useState, forwardRef } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable } from 'react-native';
import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';
import { Colors } from '../../constants';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconPress?: () => void;
  containerClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  /** Test ID for testing */
  testID?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconPress,
      containerClassName = '',
      inputClassName = '',
      disabled = false,
      secureTextEntry,
      testID,
      accessibilityLabel,
      accessibilityHint,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = secureTextEntry !== undefined;
    const shouldHidePassword = isPassword && !showPassword;

    // Generate accessibility label
    const getAccessibilityLabel = (): string => {
      if (accessibilityLabel) return accessibilityLabel;
      if (label) return label;
      if (props.placeholder) return props.placeholder;
      return 'Campo de texto';
    };

    const getBorderColor = () => {
      if (error) return 'border-red-500';
      if (isFocused) return 'border-black';
      return 'border-neutral-200';
    };

    const getBackgroundColor = () => {
      if (disabled) return 'bg-neutral-100';
      return 'bg-white';
    };

    return (
      <View className={containerClassName}>
        {label && (
          <Text
            className="text-sm font-medium text-neutral-700 mb-1.5"
            accessibilityRole="text"
          >
            {label}
          </Text>
        )}

        <View
          className={`
            flex-row items-center
            border rounded-xl px-4
            ${getBorderColor()}
            ${getBackgroundColor()}
          `}
          accessible={false}
        >
          {LeftIcon && (
            <View className="mr-3" accessibilityElementsHidden={true}>
              <LeftIcon
                size={20}
                color={error ? Colors.error : Colors.neutral[400]}
              />
            </View>
          )}

          <TextInput
            ref={ref}
            {...props}
            testID={testID}
            editable={!disabled}
            secureTextEntry={shouldHidePassword}
            accessible={true}
            accessibilityLabel={getAccessibilityLabel()}
            accessibilityHint={accessibilityHint || (error ? `Erro: ${error}` : hint)}
            accessibilityState={{
              disabled,
            }}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            placeholderTextColor={Colors.neutral[400]}
            className={`
              flex-1 py-3.5 text-base text-black
              ${inputClassName}
            `}
          />

          {isPassword && (
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="ml-2"
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              accessibilityHint="Toque para alternar a visibilidade da senha"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {showPassword ? (
                <EyeOff size={20} color={Colors.neutral[400]} />
              ) : (
                <Eye size={20} color={Colors.neutral[400]} />
              )}
            </Pressable>
          )}

          {RightIcon && !isPassword && (
            <Pressable
              onPress={onRightIconPress}
              disabled={!onRightIconPress}
              className="ml-2"
              accessible={!!onRightIconPress}
              accessibilityRole={onRightIconPress ? 'button' : undefined}
              accessibilityLabel={onRightIconPress ? 'Ação do campo' : undefined}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <RightIcon
                size={20}
                color={error ? Colors.error : Colors.neutral[400]}
              />
            </Pressable>
          )}
        </View>

        {error && (
          <Text
            className="text-sm text-red-500 mt-1"
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {error}
          </Text>
        )}

        {hint && !error && (
          <Text
            className="text-sm text-neutral-500 mt-1"
            accessibilityRole="text"
          >
            {hint}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

// Search Input variant
export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onClear?: () => void;
}

export function SearchInput({ onClear, value, accessibilityLabel, ...props }: SearchInputProps) {
  const hasValue = value && value.length > 0;

  return (
    <View
      className="flex-row items-center bg-neutral-100 rounded-xl px-4"
      accessible={false}
    >
      <TextInput
        {...props}
        value={value}
        accessible={true}
        accessibilityRole="search"
        accessibilityLabel={accessibilityLabel || 'Campo de busca'}
        placeholderTextColor={Colors.neutral[400]}
        className="flex-1 py-3 text-base text-black"
      />
      {hasValue && onClear && (
        <Pressable
          onPress={onClear}
          className="ml-2"
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          accessibilityHint="Toque para limpar o texto de busca"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-neutral-500">Limpar</Text>
        </Pressable>
      )}
    </View>
  );
}
