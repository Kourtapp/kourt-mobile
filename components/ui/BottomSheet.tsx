import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '../../constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: ('25%' | '50%' | '75%' | '90%')[];
  initialSnap?: number;
  showHandle?: boolean;
  showCloseButton?: boolean;
  enablePanGesture?: boolean;
  keyboardAvoid?: boolean;
}

const getSnapPointValue = (point: string): number => {
  const percentage = parseInt(point.replace('%', ''), 10);
  return SCREEN_HEIGHT * (percentage / 100);
};

export function BottomSheet({
  visible,
  onClose,
  children,
  title,
  snapPoints = ['50%'],
  initialSnap = 0,
  showHandle = true,
  showCloseButton = true,
  enablePanGesture = true,
  keyboardAvoid = true,
}: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const currentHeight = getSnapPointValue(snapPoints[initialSnap]);

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enablePanGesture,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return enablePanGesture && Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const content = (
    <Animated.View
      style={[
        {
          height: currentHeight,
          transform: [{ translateY }],
        },
      ]}
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
      {...panResponder.panHandlers}
    >
      {/* Handle */}
      {showHandle && (
        <View className="items-center pt-3 pb-2">
          <View className="w-10 h-1 bg-neutral-300 rounded-full" />
        </View>
      )}

      {/* Header */}
      {(title || showCloseButton) && (
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-neutral-100">
          <Text className="text-lg font-bold text-black">{title || ''}</Text>
          {showCloseButton && (
            <Pressable onPress={onClose}>
              <X size={24} color={Colors.neutral[500]} />
            </Pressable>
          )}
        </View>
      )}

      {/* Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {children}
      </ScrollView>
    </Animated.View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1">
        {/* Backdrop */}
        <Pressable
          onPress={onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Sheet */}
        {keyboardAvoid && Platform.OS === 'ios' ? (
          <KeyboardAvoidingView behavior="padding" className="flex-1">
            {content}
          </KeyboardAvoidingView>
        ) : (
          content
        )}
      </View>
    </Modal>
  );
}

// Action Sheet variant
export interface ActionSheetOption {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  icon?: React.ReactNode;
}

export interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  options: ActionSheetOption[];
  cancelLabel?: string;
}

export function ActionSheet({
  visible,
  onClose,
  title,
  message,
  options,
  cancelLabel = 'Cancelar',
}: ActionSheetProps) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={['50%']}
      showCloseButton={false}
      showHandle={true}
    >
      <View className="px-5 py-4">
        {title && (
          <Text className="text-lg font-bold text-black text-center mb-1">
            {title}
          </Text>
        )}
        {message && (
          <Text className="text-neutral-500 text-center mb-4">{message}</Text>
        )}

        <View className="gap-2">
          {options.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => {
                option.onPress();
                onClose();
              }}
              className="flex-row items-center py-4 px-4 bg-neutral-50 rounded-xl"
            >
              {option.icon && <View className="mr-3">{option.icon}</View>}
              <Text
                className={`text-base font-medium ${
                  option.destructive ? 'text-red-500' : 'text-black'
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={onClose}
          className="mt-4 py-4 bg-neutral-100 rounded-xl"
        >
          <Text className="text-base font-semibold text-neutral-600 text-center">
            {cancelLabel}
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}
