import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';

interface CourtCardProps {
    court: {
        id: string;
        name: string;
        type: 'public' | 'private';
        sport: string;
        distance: string;
        rating: number;
        price: number | null;
        currentPlayers?: number;
        image?: string;
        images?: string[];
    };
    onPress: () => void;
    onFavorite?: () => void;
    isFavorite?: boolean;
    variant?: 'compact' | 'full'; // compact = Home horizontal list, full = Map vertical list
}

// Heart icon
const HeartIcon = ({ size = 24, filled = false }: { size?: number; filled?: boolean }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#FF385C' : 'rgba(0,0,0,0.5)'}>
        <Path
            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
            stroke={filled ? '#FF385C' : '#FFFFFF'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

// Star icon
const StarIcon = ({ size = 14 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="#000">
        <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </Svg>
);

// Trophy Icon for "Guest Favorite" badge
const TrophyIcon = ({ size = 14, color = "#000" }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke={color} />
        <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke={color} />
        <Path d="M4 22h16" stroke={color} />
        <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" stroke={color} />
        <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" stroke={color} />
        <Path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" fill={color} stroke={color} />
    </Svg>
);

export function CourtCard({ court, onPress, onFavorite, isFavorite = false, variant = 'compact' }: CourtCardProps) {
    const [imgError, setImgError] = React.useState(false);
    const imageUrl = court.images?.[0] || court.image;
    const isFull = variant === 'full'; // Restored missing line
    // Fallback image (generic sports/court pattern)
    const fallbackImage = 'https://images.unsplash.com/photo-1552668693-b0c79f050ce9?q=80&w=800&auto=format&fit=crop';

    const finalImage = (imageUrl && !imgError) ? imageUrl : fallbackImage;

    return (
        <Pressable
            onPress={onPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Quadra ${court.name}, ${court.type === 'public' ? 'pública' : 'privada'}, nota ${court.rating} estrelas,  distância ${court.distance}, ${court.price ? `R$ ${court.price} por hora` : 'gratuita'}`}
            accessibilityHint="Toque duas vezes para ver detalhes da quadra"
            style={{
                width: isFull ? '100%' : 280,
                marginBottom: isFull ? 24 : 0
            }}
        >
            {/* Image Container */}
            <View style={{ position: 'relative', marginBottom: 12 }}>
                <View
                    style={{
                        height: isFull ? 320 : 180, // Taller image for full view
                        backgroundColor: '#E5E7EB',
                        borderRadius: 12,
                        overflow: 'hidden',
                    }}
                >
                    <Image
                        source={finalImage}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        transition={300}
                        onError={() => setImgError(true)}
                    />
                </View>

                {/* "Guest Favorite" Badge (Airbnb style) */}
                {isFull && court.rating >= 4.8 && (
                    <View
                        style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        <TrophyIcon size={14} color="#FFD700" />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#000' }}>
                            Preferido dos hóspedes
                        </Text>
                    </View>
                )}

                {/* "Superhost" / Type Badge (Compact mode) */}
                {!isFull && (
                    <View
                        style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 6,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                            elevation: 2,
                        }}
                    >
                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#000' }}>
                            {court.type === 'public' ? 'Pública' : 'Privada'}
                        </Text>
                    </View>
                )}


                {/* Favorite button - top right */}
                <Pressable
                    onPress={(e) => {
                        e.stopPropagation?.();
                        onFavorite?.();
                    }}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    accessibilityHint="Toque duas vezes para favoritar ou desfavoritar esta quadra"
                    accessibilityState={{ selected: isFavorite }}
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        width: 44,  // ✅ Touch target minimum
                        height: 44,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <HeartIcon size={26} filled={isFavorite} />
                </Pressable>

                {/* Dots indicator (Mock) for Full view */}
                {isFull && (
                    <View style={{
                        position: 'absolute',
                        bottom: 12,
                        left: 0,
                        right: 0,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 6
                    }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' }} />
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' }} />
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' }} />
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' }} />
                    </View>
                )}

                {/* Distance badge for compact */}
                {!isFull && (
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 4,
                        }}
                    >
                        <Text style={{ fontSize: 11, fontWeight: '600', color: '#FFFFFF' }}>
                            {court.distance}
                        </Text>
                    </View>
                )}
            </View>

            {/* Content */}
            <View>
                {/* Title row with rating */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }} numberOfLines={1}>
                            {court.name}
                        </Text>
                        <Text style={{ fontSize: 15, color: '#6B7280', marginTop: 2 }}>
                            {court.type === 'public' ? 'Quadra Pública' : 'Arena Privada'} · {court.distance}
                        </Text>
                        <Text style={{ fontSize: 15, color: '#6B7280', marginTop: 2 }}>
                            14 - 19 de dez.
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <StarIcon size={14} />
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#000' }}>
                            {court.rating} ({Math.floor(Math.random() * 100)})
                        </Text>
                    </View>
                </View>

                {/* Price */}
                <Text style={{ fontSize: 15, marginTop: 6 }}>
                    <Text style={{ fontWeight: '700', color: '#000', fontSize: 16 }}>
                        {court.price ? `R$${court.price}` : 'Gratuita'}
                    </Text>
                    <Text style={{ color: '#000', fontWeight: '400' }}>
                        {court.price ? ' /hora' : ''}
                    </Text>
                </Text>
            </View>
        </Pressable>
    );
}
