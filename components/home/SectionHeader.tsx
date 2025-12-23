import { View, Text, Pressable, StyleSheet } from 'react-native';

interface SectionHeaderProps {
    icon?: string;
    title: string;
    subtitle?: string;
    actionText?: string;
    onActionPress?: () => void;
}

// Map icon names to emojis
const ICON_EMOJI_MAP: Record<string, string> = {
    'map-pin': '📍',
    'star': '⭐',
    'thumb-up': '👍',
    'trending-up': '🔥',
    'calendar': '📅',
    'users': '👥',
    'trophy': '🏆',
};

export function SectionHeader({
    icon,
    title,
    subtitle,
    actionText = 'Ver todas',
    onActionPress,
}: SectionHeaderProps) {
    const emoji = icon ? ICON_EMOJI_MAP[icon] || icon : null;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.titleRow} accessible={true} accessibilityRole="header">
                    {emoji && (
                        <Text style={styles.emoji} accessibilityElementsHidden={true}>{emoji}</Text>
                    )}
                    <Text style={styles.title}>{title}</Text>
                </View>

                {onActionPress && (
                    <Pressable
                        onPress={onActionPress}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={actionText}
                        accessibilityHint={`Toque duas vezes para ver mais itens de ${title}`}
                        style={{ minHeight: 44, minWidth: 44, justifyContent: 'center' }}
                    >
                        <Text style={styles.actionText}>{actionText}</Text>
                    </Pressable>
                )}
            </View>

            {subtitle && (
                <Text style={styles.subtitle} accessibilityRole="text">{subtitle}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    emoji: {
        fontSize: 22,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000000',
    },
    actionText: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '500',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
});
