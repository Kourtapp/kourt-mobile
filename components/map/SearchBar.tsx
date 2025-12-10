import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface SearchBarProps {
    onFilterPress: () => void;
}

export function SearchBar({ onFilterPress }: SearchBarProps) {
    return (
        <View className="flex-row items-center gap-2 mb-3">
            <Pressable onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
                <MaterialIcons name="arrow-back" size={20} color="#000" />
            </Pressable>

            <Pressable
                onPress={() => router.push('/search')}
                className="flex-1 flex-row items-center bg-white border border-neutral-300 rounded-full shadow-sm overflow-hidden"
            >
                <View className="flex-1 px-4 py-2.5">
                    <Text className="text-sm font-medium text-black">Quadras por perto</Text>
                    <Text className="text-xs text-neutral-500">Qualquer horário · Todos esportes</Text>
                </View>
                <Pressable
                    onPress={(e) => {
                        e.stopPropagation();
                        onFilterPress();
                    }}
                    className="w-10 h-10 items-center justify-center border-l border-neutral-200"
                >
                    <MaterialIcons name="tune" size={20} color="#000" />
                </Pressable>
            </Pressable>
        </View>
    );
}
