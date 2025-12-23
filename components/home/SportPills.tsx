import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SportPillsProps {
    sports: { id: string; name: string; icon: string }[];
    selectedSport: string;
    onSelect: (sportId: string) => void;
}

export function SportPills({ sports, selectedSport, onSelect }: SportPillsProps) {
    return (
        <View className="mb-4">
            <View className="flex-row items-center gap-2 px-5 mb-2">
                <Text className="text-xs text-neutral-500">Seus esportes</Text>
                <MaterialIcons name="info" size={14} color="#A3A3A3" />
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
            >
                <Pressable
                    onPress={() => onSelect('all')}
                    className={`flex-row items-center gap-2 px-4 py-2.5 rounded-full ${selectedSport === 'all'
                            ? 'bg-black'
                            : 'bg-white border border-neutral-200'
                        }`}
                >
                    <Text className={`text-sm font-medium ${selectedSport === 'all' ? 'text-white' : 'text-black'
                        }`}>
                        Todos
                    </Text>
                </Pressable>

                {sports.map((sport) => (
                    <Pressable
                        key={sport.id}
                        onPress={() => onSelect(sport.id)}
                        className={`flex-row items-center gap-2 px-4 py-2.5 rounded-full ${selectedSport === sport.id
                                ? 'bg-black'
                                : 'bg-white border border-neutral-200'
                            }`}
                    >
                        <MaterialIcons
                            name={sport.icon as any}
                            size={18}
                            color={selectedSport === sport.id ? '#FFF' : '#000'}
                        />
                        <Text className={`text-sm font-medium ${selectedSport === sport.id ? 'text-white' : 'text-black'
                            }`}>
                            {sport.name}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
