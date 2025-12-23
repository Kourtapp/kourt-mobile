import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';

const stories = [
    { id: 'me', name: 'Seu status', isMe: true },
    { id: '1', name: 'Pedro', image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', hasStory: true },
    { id: '2', name: 'Marina', image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', hasStory: true },
    { id: '3', name: 'Lucas', image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', hasStory: false },
    { id: '4', name: 'Carol', image: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', hasStory: true },
];

export function StoriesRail() {
    return (
        <View className="py-4 border-b border-neutral-100 bg-white">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                {stories.map((story) => (
                    <TouchableOpacity key={story.id}>
                        <View className="mr-5 items-center gap-2">
                            <View className={`w-16 h-16 rounded-full p-[2px] ${story.hasStory ? 'border-2 border-green-500' : 'border border-neutral-200'}`}>
                                <View className="w-full h-full rounded-full bg-neutral-100 overflow-hidden items-center justify-center">
                                    {story.isMe ? (
                                        <Plus size={24} color="#A3A3A3" />
                                    ) : (
                                        <Image source={{ uri: story.image }} className="w-full h-full" />
                                    )}
                                </View>
                                {story.isMe && (
                                    <View className="absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full items-center justify-center">
                                        <View className="w-4 h-4 bg-black rounded-full items-center justify-center">
                                            <Plus size={10} color="white" />
                                        </View>
                                    </View>
                                )}
                            </View>
                            <Text className={`text-xs ${story.hasStory ? 'font-bold text-black' : 'text-neutral-500'}`}>
                                {story.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
