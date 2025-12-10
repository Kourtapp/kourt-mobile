import { ScrollView, Text, Pressable } from 'react-native';

interface FilterPillsProps {
    selected: string;
    onSelect: (filter: string) => void;
}

const FILTERS = [
    { id: 'all', label: 'Todos' },
    { id: 'price', label: '💰 Preço' },
    { id: 'free', label: 'Gratuitas' },
    { id: 'available', label: 'Disponíveis' },
];

export function FilterPills({ selected, onSelect }: FilterPillsProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingRight: 20 }}
        >
            {FILTERS.map((filter) => (
                <Pressable
                    key={filter.id}
                    onPress={() => onSelect(filter.id)}
                    className={`px-3 py-1.5 rounded-full border ${selected === filter.id
                            ? 'bg-black border-black'
                            : 'bg-white border-neutral-300'
                        }`}
                >
                    <Text className={`text-xs font-medium ${selected === filter.id ? 'text-white' : 'text-black'
                        }`}>
                        {filter.label}
                    </Text>
                </Pressable>
            ))}
        </ScrollView>
    );
}
