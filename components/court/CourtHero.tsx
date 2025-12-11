import React from 'react';
import { View, Image, Dimensions, Pressable, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { router } from 'expo-router';
import { ArrowLeft, Heart, Share } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CourtHeroProps {
    images: string[];
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onShare?: () => void;
}

export function CourtHero({ images, isFavorite, onToggleFavorite, onShare }: CourtHeroProps) {
    const scrollX = useSharedValue(0);
    const validImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800'];

    return (
        <View style={{ position: 'relative', height: 300, backgroundColor: '#000' }}>
            <Animated.ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                    scrollX.value = e.nativeEvent.contentOffset.x;
                }}
                scrollEventThrottle={16}
            >
                {validImages.map((img, index) => (
                    <Image
                        key={index}
                        source={{ uri: img }}
                        style={{ width: SCREEN_WIDTH, height: 300 }}
                        resizeMode="cover"
                    />
                ))}
            </Animated.ScrollView>

            {/* Top Action Bar */}
            <View
                style={{
                    position: 'absolute',
                    top: 50,
                    left: 0,
                    right: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20
                }}
            >
                {/* Back Button */}
                <Pressable
                    onPress={() => router.back()}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 4,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                    }}
                >
                    <ArrowLeft size={20} color="#000" />
                </Pressable>

                {/* Right Actions */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Pressable
                        onPress={onShare}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            elevation: 4,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                        }}
                    >
                        <Share size={20} color="#000" />
                    </Pressable>

                    <Pressable
                        onPress={onToggleFavorite}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            elevation: 4,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                        }}
                    >
                        <Heart size={20} color={isFavorite ? "#FF385C" : "#000"} fill={isFavorite ? "#FF385C" : "transparent"} />
                    </Pressable>
                </View>
            </View>

            {/* Pagination Indicator */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 12,
                }}
            >
                {/* We won't use state for this to avoid re-renders on scroll, usually simple text is fine */}
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                    1 / {validImages.length}
                </Text>
            </View>
        </View>
    );
}
