import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MOCK_GROUPS = [
    {
        id: '1',
        name: 'Beach Tennis SP',
        members: 1240,
        image: 'https://images.unsplash.com/photo-1617693322135-1383c4e72320?q=80&w=200&auto=format&fit=crop',
        isMember: true,
    },
    {
        id: '2',
        name: 'Padel Brasil',
        members: 850,
        image: 'https://images.unsplash.com/photo-1554068865-2484cd13263b?q=80&w=200&auto=format&fit=crop',
        isMember: false,
    },
];

export function GroupsTab() {
    return (
        <ScrollView
            className="flex-1 bg-[#fafafa]"
            contentContainerStyle={{ padding: 20, gap: 12 }}
            showsVerticalScrollIndicator={false}
        >
            <Text className="text-sm font-bold text-black mb-2">Seus grupos</Text>

            {MOCK_GROUPS.map((group) => (
                <View key={group.id} className="flex-row items-center bg-white p-3 rounded-xl border border-neutral-200">
                    <Image
                        source={{ uri: group.image }}
                        className="w-12 h-12 rounded-xl bg-neutral-200"
                    />

                    <View className="flex-1 ml-3">
                        <Text className="font-bold text-black text-sm">{group.name}</Text>
                        <Text className="text-xs text-neutral-500">
                            {group.members.toLocaleString()} membros
                        </Text>
                    </View>

                    <Pressable
                        className={`w-8 h-8 rounded-full items-center justify-center ${group.isMember ? 'bg-neutral-100' : 'bg-black'
                            }`}
                    >
                        <MaterialIcons
                            name={group.isMember ? "check" : "add"}
                            size={18}
                            color={group.isMember ? "#000" : "#FFF"}
                        />
                    </Pressable>
                </View>
            ))}
        </ScrollView>
    );
}
