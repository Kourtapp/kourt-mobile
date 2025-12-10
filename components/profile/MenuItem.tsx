import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MenuItemProps {
    icon: string;
    label: string;
    onPress: () => void;
    isDestructive?: boolean;
}

export function MenuItem({ icon, label, onPress, isDestructive }: MenuItemProps) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center justify-between py-4 border-b border-neutral-100"
        >
            <View className="flex-row items-center gap-3">
                <View className={`w-8 h-8 rounded-full items-center justify-center ${isDestructive ? 'bg-red-50' : 'bg-neutral-50'
                    }`}>
                    <MaterialIcons
                        name={icon as any}
                        size={18}
                        color={isDestructive ? '#EF4444' : '#000'}
                    />
                </View>
                <Text className={`text-sm font-medium ${isDestructive ? 'text-red-500' : 'text-black'
                    }`}>
                    {label}
                </Text>
            </View>

            <MaterialIcons name="chevron-right" size={20} color="#A3A3A3" />
        </Pressable>
    );
}
