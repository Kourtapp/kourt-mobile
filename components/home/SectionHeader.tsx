import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SectionHeaderProps {
    icon?: string;
    title: string;
    subtitle?: string;
    actionText?: string;
    onActionPress?: () => void;
}

export function SectionHeader({
    icon,
    title,
    subtitle,
    actionText = 'Ver todas',
    onActionPress,
}: SectionHeaderProps) {
    return (
        <View className="px-5 mb-3">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                    {icon && (
                        <MaterialIcons name={icon as any} size={28} color="#000" />
                    )}
                    <Text className="text-2xl font-bold text-black">{title}</Text>
                </View>

                {onActionPress && (
                    <Pressable onPress={onActionPress}>
                        <Text className="text-sm text-blue-600 font-medium">{actionText}</Text>
                    </Pressable>
                )}
            </View>

            {subtitle && (
                <Text className="text-sm text-neutral-500 mt-1">{subtitle}</Text>
            )}
        </View>
    );
}
