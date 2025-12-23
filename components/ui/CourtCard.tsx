import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { MapPin, Star, Heart } from 'lucide-react-native';
import { Colors } from '../../constants';
import { Badge } from './Badge';
import { SPORTS_MAP } from '../../constants/sports';

interface CourtCardProps {
  id: string;
  name: string;
  address?: string;
  distance?: string;
  rating: number;
  reviewCount: number;
  price: number;
  sports: string[];
  images?: string[];
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  variant?: 'default' | 'compact' | 'horizontal';
}

export function CourtCard({
  id,
  name,
  address,
  distance,
  rating,
  reviewCount,
  price,
  sports,
  images,
  isFavorite = false,
  onFavoritePress,
  variant = 'default',
}: CourtCardProps) {
  const handlePress = () => {
    router.push(`/court/${id}`);
  };

  if (variant === 'compact') {
    return (
      <Pressable
        onPress={handlePress}
        className="bg-white rounded-2xl w-64 border border-neutral-100 overflow-hidden"
      >
        <View className="h-32 bg-neutral-200">
          {images?.[0] && (
            <Image source={{ uri: images[0] }} className="w-full h-full" />
          )}
          {onFavoritePress && (
            <Pressable
              onPress={onFavoritePress}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full items-center justify-center"
            >
              <Heart
                size={18}
                fill={isFavorite ? Colors.error : 'transparent'}
                color={isFavorite ? Colors.error : Colors.neutral[600]}
              />
            </Pressable>
          )}
        </View>
        <View className="p-4">
          <Text className="font-semibold text-black" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-xs text-neutral-500 mt-1">{distance}</Text>
          <View className="flex-row items-center mt-2">
            <Star size={14} fill={Colors.warning} color={Colors.warning} />
            <Text className="text-xs text-neutral-600 ml-1">
              {rating} ({reviewCount})
            </Text>
            <Text className="text-sm font-semibold text-black ml-auto">
              R$ {price}/h
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Pressable
        onPress={handlePress}
        className="bg-white rounded-2xl flex-row overflow-hidden border border-neutral-100"
      >
        <View className="w-28 h-28 bg-neutral-200">
          {images?.[0] && (
            <Image source={{ uri: images[0] }} className="w-full h-full" />
          )}
        </View>
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="font-semibold text-black" numberOfLines={1}>
              {name}
            </Text>
            <View className="flex-row items-center mt-1">
              <MapPin size={12} color={Colors.neutral[500]} />
              <Text className="text-xs text-neutral-500 ml-1">{distance}</Text>
              <Text className="text-neutral-300 mx-1">•</Text>
              <Star size={12} fill={Colors.warning} color={Colors.warning} />
              <Text className="text-xs text-neutral-600 ml-1">{rating}</Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row gap-1">
              {sports.slice(0, 2).map((sport) => (
                <Text key={sport} className="text-xs">
                  {SPORTS_MAP[sport]?.emoji}
                </Text>
              ))}
            </View>
            <Text className="font-bold text-black">R$ {price}/h</Text>
          </View>
        </View>
      </Pressable>
    );
  }

  // Default variant
  return (
    <Pressable
      onPress={handlePress}
      className="bg-white rounded-2xl overflow-hidden border border-neutral-100"
    >
      <View className="h-36 bg-neutral-200">
        {images?.[0] && (
          <Image source={{ uri: images[0] }} className="w-full h-full" />
        )}
        {onFavoritePress && (
          <Pressable
            onPress={onFavoritePress}
            className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow"
          >
            <Heart
              size={20}
              fill={isFavorite ? Colors.error : 'transparent'}
              color={isFavorite ? Colors.error : Colors.neutral[600]}
            />
          </Pressable>
        )}
      </View>
      <View className="p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="font-semibold text-black text-lg" numberOfLines={1}>
              {name}
            </Text>
            <View className="flex-row items-center mt-1">
              <MapPin size={14} color={Colors.neutral[500]} />
              <Text className="text-sm text-neutral-500 ml-1">
                {distance || address}
              </Text>
              <Text className="text-neutral-300 mx-2">•</Text>
              <Star size={14} fill={Colors.warning} color={Colors.warning} />
              <Text className="text-sm text-neutral-600 ml-1">
                {rating} ({reviewCount})
              </Text>
            </View>
          </View>
          <Text className="font-bold text-black text-lg">R$ {price}/h</Text>
        </View>
        <View className="flex-row gap-2 mt-3">
          {sports.map((sport) => (
            <Badge key={sport} variant="default">
              {SPORTS_MAP[sport]?.emoji} {SPORTS_MAP[sport]?.name}
            </Badge>
          ))}
        </View>
      </View>
    </Pressable>
  );
}
