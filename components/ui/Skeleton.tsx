import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle, DimensionValue } from 'react-native';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as DimensionValue,
          height: height as DimensionValue,
          borderRadius,
          backgroundColor: '#E5E5E5',
          opacity,
        } as Animated.WithAnimatedValue<ViewStyle>,
        style,
      ]}
    />
  );
}

// Pre-built skeleton components for common use cases

export function SkeletonText({
  lines = 1,
  lineHeight = 16,
  spacing = 8,
}: {
  lines?: number;
  lineHeight?: number;
  spacing?: number;
}) {
  return (
    <View style={{ gap: spacing }}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={lineHeight}
          width={index === lines - 1 && lines > 1 ? '60%' : '100%'}
          borderRadius={4}
        />
      ))}
    </View>
  );
}

export function SkeletonAvatar({
  size = 48,
}: {
  size?: number;
}) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} />;
}

export function SkeletonCard() {
  return (
    <View className="bg-white rounded-2xl overflow-hidden border border-neutral-100">
      <Skeleton height={140} borderRadius={0} />
      <View className="p-4">
        <Skeleton height={20} width="70%" style={{ marginBottom: 8 }} />
        <Skeleton height={14} width="50%" style={{ marginBottom: 12 }} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Skeleton height={24} width={80} borderRadius={12} />
          <Skeleton height={24} width={60} borderRadius={12} />
        </View>
      </View>
    </View>
  );
}

export function SkeletonCourtCard() {
  return (
    <View className="bg-white rounded-2xl overflow-hidden border border-neutral-100">
      <Skeleton height={140} borderRadius={0} />
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Skeleton height={20} width="70%" style={{ marginBottom: 8 }} />
            <Skeleton height={14} width="40%" />
          </View>
          <Skeleton height={24} width={70} borderRadius={4} />
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <Skeleton height={28} width={100} borderRadius={14} />
          <Skeleton height={28} width={80} borderRadius={14} />
        </View>
      </View>
    </View>
  );
}

export function SkeletonBookingCard() {
  return (
    <View className="bg-white rounded-2xl overflow-hidden border border-neutral-100">
      <Skeleton height={120} borderRadius={0} />
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-3">
          <Skeleton height={20} width="60%" />
          <Skeleton height={24} width={80} borderRadius={12} />
        </View>
        <Skeleton height={14} width="50%" style={{ marginBottom: 12 }} />
        <View className="flex-row gap-4 pt-3 border-t border-neutral-100">
          <Skeleton height={16} width={100} />
          <Skeleton height={16} width={120} />
        </View>
        <View className="flex-row gap-2 mt-3">
          <Skeleton height={28} width={80} borderRadius={14} />
          <Skeleton height={28} width={100} borderRadius={14} />
        </View>
      </View>
    </View>
  );
}

export function SkeletonActivityCard() {
  return (
    <View className="bg-white rounded-2xl p-4 border border-neutral-100">
      <View className="flex-row items-center mb-3">
        <SkeletonAvatar size={44} />
        <View className="flex-1 ml-3">
          <Skeleton height={16} width="50%" style={{ marginBottom: 6 }} />
          <Skeleton height={12} width="30%" />
        </View>
        <Skeleton height={16} width={16} borderRadius={8} />
      </View>
      <Skeleton height={14} width="80%" style={{ marginBottom: 12 }} />
      <View className="flex-row gap-2">
        <Skeleton height={24} width={70} borderRadius={12} />
        <Skeleton height={24} width={50} borderRadius={12} />
      </View>
    </View>
  );
}

export function SkeletonNotificationCard() {
  return (
    <View className="bg-white rounded-2xl p-4 border border-neutral-100">
      <View className="flex-row">
        <Skeleton width={48} height={48} borderRadius={24} />
        <View className="flex-1 ml-3">
          <Skeleton height={16} width="70%" style={{ marginBottom: 6 }} />
          <Skeleton height={14} width="90%" style={{ marginBottom: 6 }} />
          <Skeleton height={12} width="30%" />
        </View>
      </View>
    </View>
  );
}

export function SkeletonProfileHeader() {
  return (
    <View className="items-center">
      <SkeletonAvatar size={96} />
      <Skeleton height={24} width={150} style={{ marginTop: 16, marginBottom: 8 }} />
      <Skeleton height={14} width={100} style={{ marginBottom: 8 }} />
      <Skeleton height={14} width={200} />
    </View>
  );
}

export function SkeletonStatCard() {
  return (
    <View className="flex-1 items-center p-4">
      <Skeleton width={40} height={40} borderRadius={20} style={{ marginBottom: 8 }} />
      <Skeleton height={20} width={40} style={{ marginBottom: 4 }} />
      <Skeleton height={12} width={60} />
    </View>
  );
}
