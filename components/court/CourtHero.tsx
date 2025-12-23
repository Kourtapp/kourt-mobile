import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { View, Image, Dimensions, Pressable, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Heart, Share } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CourtImage {
    url: string;
    label?: string; // "Quadra 1", "Quadra 2", etc.
}

interface CourtHeroProps {
    images: (string | CourtImage)[];
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onShare?: () => void;
}

export interface CourtHeroRef {
    scrollToIndex: (index: number) => void;
}

export const CourtHero = forwardRef<CourtHeroRef, CourtHeroProps>(
    ({ images, isFavorite, onToggleFavorite, onShare }, ref) => {
        const scrollViewRef = useRef<ScrollView>(null);
        const [currentIndex, setCurrentIndex] = useState(0);

        // Normalize images to CourtImage format
        const normalizedImages: CourtImage[] = images.length > 0
            ? images.map((img, idx) => {
                if (typeof img === 'string') {
                    return { url: img };
                }
                return img;
            })
            : [{ url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800' }];

        // Expose scrollToIndex method to parent
        useImperativeHandle(ref, () => ({
            scrollToIndex: (index: number) => {
                if (scrollViewRef.current && index >= 0 && index < normalizedImages.length) {
                    scrollViewRef.current.scrollTo({
                        x: index * SCREEN_WIDTH,
                        animated: true,
                    });
                }
            },
        }));

        const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / SCREEN_WIDTH);
            if (index !== currentIndex && index >= 0 && index < normalizedImages.length) {
                setCurrentIndex(index);
            }
        };

        return (
            <View style={{ position: 'relative', height: 300, backgroundColor: '#000' }}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {normalizedImages.map((img, index) => (
                        <View key={index} style={{ width: SCREEN_WIDTH, height: 300 }}>
                            <Image
                                source={{ uri: img.url }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                            />
                            {/* Court Label Overlay */}
                            {img.label && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 60,
                                        left: 20,
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        paddingHorizontal: 14,
                                        paddingVertical: 8,
                                        borderRadius: 8,
                                    }}
                                >
                                    <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '700' }}>
                                        {img.label}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>

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
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                        {currentIndex + 1} / {normalizedImages.length}
                    </Text>
                </View>

                {/* Dot Indicators */}
                {normalizedImages.length > 1 && (
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            left: 0,
                            right: 0,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 6,
                        }}
                    >
                        {normalizedImages.map((_, index) => (
                            <View
                                key={index}
                                style={{
                                    width: index === currentIndex ? 20 : 6,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: index === currentIndex ? '#FFF' : 'rgba(255,255,255,0.5)',
                                }}
                            />
                        ))}
                    </View>
                )}
            </View>
        );
    }
);

CourtHero.displayName = 'CourtHero';
