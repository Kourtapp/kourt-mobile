import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '../constants';
import { IconButton } from '../components/ui';

export default function AchievementsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-5 py-4 border-b border-neutral-100">
                <IconButton
                    icon={ChevronLeft}
                    onPress={() => router.back()}
                    variant="default"
                    iconColor={Colors.primary}
                />
                <Text className="flex-1 text-xl font-bold text-black text-center mr-10">
                    Conquistas
                </Text>
            </View>

            <View className="flex-1 items-center justify-center">
                <Text className="text-xl font-bold text-neutral-400">Em breve</Text>
            </View>
        </SafeAreaView>
    );
}
