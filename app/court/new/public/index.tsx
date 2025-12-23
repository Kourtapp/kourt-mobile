import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { Button } from '../../../../components/ui/Button';

export default function PublicCourtIntroScreen() {
    const router = useRouter();

    const steps = [
        {
            id: 1,
            title: "Prepare o terreno",
            description: "Defina a localização e o tipo de quadra para os jogadores te encontrarem.",
        },
        {
            id: 2,
            title: "Capriche no visual",
            description: "Adicione fotos e detalhes que mostrem por que sua quadra é única.",
        },
        {
            id: 3,
            title: "Abra pro jogo",
            description: "Revise tudo e publique para começar a receber a galera.",
        },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View className="flex-1 px-6">
                {/* Header */}
                <View className="h-12 justify-center -ml-2 mb-4">
                    <Pressable
                        onPress={() => router.back()}
                        className="p-2 w-10 h-10 items-center justify-center rounded-full active:bg-neutral-100"
                    >
                        <X size={24} color="black" />
                    </Pressable>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Title */}
                    <Text className="text-3xl font-bold text-black mb-12 leading-tight">
                        Cadastre sua quadra,{'\n'}é fácil.
                    </Text>

                    {/* Steps */}
                    <View className="space-y-10">
                        {steps.map((step) => (
                            <View key={step.id} className="flex-row items-start justify-between">
                                <View className="flex-1 pr-4">
                                    <Text className="text-lg font-bold text-black mb-1">
                                        {step.id} {step.title}
                                    </Text>
                                    <Text className="text-base text-neutral-500 leading-6">
                                        {step.description}
                                    </Text>
                                </View>
                                {/* Placeholder Image */}
                                <View className="w-20 h-20 bg-neutral-100 rounded-2xl" />
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Footer */}
                <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-neutral-100">
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={() => router.push('/court/new/public/location-permission')}
                    >
                        Começar
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
}
