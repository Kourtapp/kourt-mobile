import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LucideIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../constants';

// Premium 3D illustrations for empty states - Playtomic style
export const EMPTY_STATE_IMAGES = {
    // Sports & Matches
    noMatches: 'https://cdn-icons-png.flaticon.com/512/3043/3043893.png',
    noPosts: 'https://cdn-icons-png.flaticon.com/512/4076/4076478.png',
    noTournaments: 'https://cdn-icons-png.flaticon.com/512/3112/3112946.png',
    noMessages: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png',
    noInvites: 'https://cdn-icons-png.flaticon.com/512/3596/3596091.png',
    noResults: 'https://cdn-icons-png.flaticon.com/512/6134/6134065.png',
    noNotifications: 'https://cdn-icons-png.flaticon.com/512/3602/3602123.png',
    noPlayers: 'https://cdn-icons-png.flaticon.com/512/1256/1256650.png',
    noCourts: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
    noBookings: 'https://cdn-icons-png.flaticon.com/512/2693/2693507.png',
    noSaved: 'https://cdn-icons-png.flaticon.com/512/5662/5662990.png',
    noEquipment: 'https://cdn-icons-png.flaticon.com/512/2503/2503508.png',
    noPayments: 'https://cdn-icons-png.flaticon.com/512/4108/4108843.png',
    noStats: 'https://cdn-icons-png.flaticon.com/512/3281/3281289.png',
    noGroups: 'https://cdn-icons-png.flaticon.com/512/681/681494.png',
    noChats: 'https://cdn-icons-png.flaticon.com/512/4213/4213732.png',
    error: 'https://cdn-icons-png.flaticon.com/512/595/595067.png',
    success: 'https://cdn-icons-png.flaticon.com/512/845/845646.png',
} as const;

export type EmptyStateType = keyof typeof EMPTY_STATE_IMAGES;

interface EmptyStateProps {
    // New API with image types
    type?: EmptyStateType;
    image?: string | number;
    // Legacy API with icons (backward compatible)
    icon?: LucideIcon;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    style?: ViewStyle;
    compact?: boolean;
}

export function EmptyState({
    type,
    image,
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    style,
    compact = false,
}: EmptyStateProps) {
    // Determine if we should use image or icon
    const useImage = type || image;
    const imageSource = image || (type ? EMPTY_STATE_IMAGES[type] : null);

    // If no type/image provided but has icon, use legacy rendering
    if (!useImage && Icon) {
        return (
            <View className="flex-1 items-center justify-center py-20 px-10" accessible={true} accessibilityRole="text" accessibilityLabel={`${title}. ${description || ''}`}>
                <View className="w-20 h-20 bg-neutral-100 rounded-full items-center justify-center mb-4" accessibilityElementsHidden={true}>
                    <Icon size={40} color={Colors.neutral[400]} />
                </View>
                <Text className="text-lg font-semibold text-neutral-700 text-center" accessibilityRole="header">
                    {title}
                </Text>
                {description && (
                    <Text className="text-neutral-500 text-center mt-2">{description}</Text>
                )}
                {actionLabel && onAction && (
                    <Pressable
                        onPress={onAction}
                        className="bg-black px-6 py-3 rounded-xl mt-6"
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={actionLabel}
                        accessibilityHint="Toque duas vezes para executar esta ação"
                        style={{ minHeight: 44 }}
                    >
                        <Text className="text-white font-semibold">{actionLabel}</Text>
                    </Pressable>
                )}
            </View>
        );
    }

    // New premium image-based rendering
    const isRemoteImage = typeof imageSource === 'string';

    return (
        <Animated.View
            entering={FadeIn.duration(400)}
            style={[styles.container, compact && styles.containerCompact, style]}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`${title}. ${description || ''}`}
        >
            {/* Gradient background circle with 3D image */}
            <Animated.View
                entering={FadeInUp.delay(100).springify()}
                style={[styles.imageContainer, compact && styles.imageContainerCompact]}
                accessibilityElementsHidden={true}
            >
                <LinearGradient
                    colors={['#F0F7FF', '#E8F4FF', '#FAFAFA']}
                    style={styles.gradientCircle}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                <Image
                    source={isRemoteImage ? { uri: imageSource } : imageSource}
                    style={[styles.image, compact && styles.imageCompact]}
                    contentFit="contain"
                    transition={300}
                    accessible={true}
                    accessibilityLabel={`Ilustração de ${title.toLowerCase()}`}
                />
            </Animated.View>

            {/* Text content */}
            <Animated.View
                entering={FadeInUp.delay(200).springify()}
                style={styles.textContainer}
            >
                <Text style={[styles.title, compact && styles.titleCompact]} accessibilityRole="header">
                    {title}
                </Text>
                {description && (
                    <Text style={[styles.description, compact && styles.descriptionCompact]}>
                        {description}
                    </Text>
                )}
            </Animated.View>

            {/* Action button */}
            {actionLabel && onAction && (
                <Animated.View entering={FadeInUp.delay(300).springify()}>
                    <Pressable
                        onPress={onAction}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={actionLabel}
                        accessibilityHint="Toque duas vezes para executar esta ação"
                        style={({ pressed }) => [
                            styles.actionButton,
                            pressed && styles.actionButtonPressed,
                        ]}
                    >
                        <Text style={styles.actionButtonText}>{actionLabel}</Text>
                    </Pressable>
                </Animated.View>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 48,
    },
    containerCompact: {
        paddingVertical: 24,
    },
    imageContainer: {
        width: 180,
        height: 180,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    imageContainerCompact: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    gradientCircle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 999,
        opacity: 0.6,
    },
    image: {
        width: 120,
        height: 120,
    },
    imageCompact: {
        width: 80,
        height: 80,
    },
    textContainer: {
        alignItems: 'center',
        maxWidth: 280,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 8,
    },
    titleCompact: {
        fontSize: 16,
    },
    description: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
    },
    descriptionCompact: {
        fontSize: 13,
        lineHeight: 18,
    },
    actionButton: {
        marginTop: 24,
        backgroundColor: '#111827',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    actionButtonPressed: {
        backgroundColor: '#374151',
        transform: [{ scale: 0.98 }],
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});
