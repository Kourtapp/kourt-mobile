import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { TeamService } from '../../services/teamService';

const SPORTS = ['Futebol', 'Beach Tennis', 'Padel', 'Tênis', 'Vôlei', 'Basquete'];

export default function CreateTeamScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [selectedSport, setSelectedSport] = useState(SPORTS[0]);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) {
            Alert.alert('Ops', 'Por favor, digite o nome do time.');
            return;
        }

        setLoading(true);
        try {
            await TeamService.createTeam({
                name,
                sport: selectedSport,
                description
            });
            Alert.alert('Sucesso', 'Time criado com sucesso!');
            router.back();
        } catch {
            Alert.alert('Erro', 'Não foi possível criar o time.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#FAFAFA]">
            <Stack.Screen
                options={{
                    title: 'Novo Time',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#FAFAFA' },
                    headerTintColor: '#0F172A',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                            <MaterialIcons name="arrow-back" size={24} color="#0F172A" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Name Input */}
                <View className="mb-6">
                    <Text className="text-sm font-bold text-neutral-900 mb-2">Nome do Time</Text>
                    <TextInput
                        className="bg-white px-4 py-3 rounded-xl border border-neutral-200 text-neutral-900"
                        placeholder="Ex: Os Boleiros"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Sport Selection */}
                <View className="mb-6">
                    <Text className="text-sm font-bold text-neutral-900 mb-3">Esporte</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {SPORTS.map(sport => (
                            <TouchableOpacity
                                key={sport}
                                onPress={() => setSelectedSport(sport)}
                                className={`px-4 py-2 rounded-full border ${selectedSport === sport
                                    ? 'bg-neutral-900 border-neutral-900'
                                    : 'bg-white border-neutral-200'
                                    }`}
                            >
                                <Text
                                    className={`font-semibold ${selectedSport === sport ? 'text-white' : 'text-neutral-500'
                                        }`}
                                >
                                    {sport}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Description */}
                <View className="mb-8">
                    <Text className="text-sm font-bold text-neutral-900 mb-2">Descrição (Opcional)</Text>
                    <TextInput
                        className="bg-white px-4 py-3 rounded-xl border border-neutral-200 text-neutral-900 h-24"
                        placeholder="Ex: Time focado no campeonato estadual..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleCreate}
                    disabled={loading}
                    className="bg-green-500 py-4 rounded-xl items-center shadow-sm shadow-green-200"
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-base">Criar Time</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
