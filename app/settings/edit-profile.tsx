import { View, Text, Pressable, TextInput, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase, uploadFile } from '@/lib/supabase';
import { useUserStore } from '@/stores/useUserStore';
import * as FileSystem from 'expo-file-system';

const SPORTS_OPTIONS = [
    { id: 'beach-tennis', label: 'Beach Tennis', icon: '🎾' },
    { id: 'padel', label: 'Padel', icon: '🎾' },
    { id: 'tennis', label: 'Tênis', icon: '🎾' },
    { id: 'futevolei', label: 'Futevôlei', icon: '⚽' },
    { id: 'volley', label: 'Vôlei', icon: '🏐' },
    { id: 'footvolley', label: 'Futmesa', icon: '⚽' },
];

export default function EditProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { profile, updateProfile, fetchProfile } = useUserStore();

    // Form states
    const [name, setName] = useState(profile?.name || '');
    const [bio, setBio] = useState(profile?.bio || '');
    const [location, setLocation] = useState(profile?.location || '');
    const [selectedSports, setSelectedSports] = useState<string[]>(
        profile?.sports?.map(s => s.id) || []
    );
    const [avatarUri, setAvatarUri] = useState<string | null>(profile?.avatar_url || null);
    const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const toggleSport = (sportId: string) => {
        if (selectedSports.includes(sportId)) {
            setSelectedSports(selectedSports.filter(s => s !== sportId));
        } else {
            if (selectedSports.length < 3) {
                setSelectedSports([...selectedSports, sportId]);
            } else {
                Alert.alert('Limite', 'Você pode selecionar até 3 esportes');
            }
        }
    };

    const handlePickAvatar = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: true,
                aspect: [1, 1],
            });

            if (!result.canceled && result.assets?.[0]) {
                setNewAvatarUri(result.assets[0].uri);
                setAvatarUri(result.assets[0].uri);
            }
        } catch (error) {
            console.log('Error picking avatar:', error);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        }
    };

    const uploadAvatar = async (uri: string): Promise<string | null> => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const extension = uri.split('.').pop() || 'jpg';
            const fileName = `${profile?.id}/avatar_${Date.now()}.${extension}`;

            const response = await fetch(`data:image/${extension};base64,${base64}`);
            const blob = await response.blob();

            const result = await uploadFile('avatars', fileName, blob, { upsert: true });
            return result.publicUrl;
        } catch (error) {
            console.error('[uploadAvatar] Error:', error);
            return null;
        }
    };

    const handleSave = async () => {
        if (!profile?.id) return;

        if (!name.trim()) {
            Alert.alert('Atenção', 'O nome é obrigatório');
            return;
        }

        setSaving(true);

        try {
            let avatarUrl = profile.avatar_url;

            // Upload new avatar if changed
            if (newAvatarUri) {
                const uploadedUrl = await uploadAvatar(newAvatarUri);
                if (uploadedUrl) {
                    avatarUrl = uploadedUrl;
                }
            }

            // Update profile in Supabase
            const { error } = await supabase
                .from('profiles')
                .update({
                    name: name.trim(),
                    bio: bio.trim() || null,
                    city: location.trim() || null,
                    sports: selectedSports,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', profile.id);

            if (error) {
                throw error;
            }

            // Update local state
            updateProfile({
                name: name.trim(),
                bio: bio.trim(),
                location: location.trim(),
                sports: selectedSports.map(id => {
                    const sport = SPORTS_OPTIONS.find(s => s.id === id);
                    return { id, name: sport?.label || id, icon: sport?.icon || '🎾' };
                }),
                avatar_url: avatarUrl || undefined,
            });

            // Refresh profile
            await fetchProfile(profile.id);

            Alert.alert('Sucesso', 'Perfil atualizado!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('[EditProfile] Save error:', error);
            Alert.alert('Erro', error.message || 'Não foi possível salvar as alterações');
        } finally {
            setSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
                <Pressable onPress={() => router.back()} className="flex-row items-center gap-1">
                    <ChevronLeft size={24} color="#000" />
                    <Text className="text-base font-semibold">Voltar</Text>
                </Pressable>
                <Text className="text-lg font-bold">Editar Perfil</Text>
                <View style={{ width: 70 }} />
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
                {/* Avatar */}
                <View className="items-center mb-8">
                    <Pressable onPress={handlePickAvatar} className="relative">
                        <View className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden">
                            {avatarUri ? (
                                <Image source={{ uri: avatarUri }} className="w-full h-full" />
                            ) : (
                                <View className="w-full h-full items-center justify-center">
                                    <User size={48} color="#9CA3AF" />
                                </View>
                            )}
                        </View>
                        <View className="absolute bottom-0 right-0 w-9 h-9 bg-black rounded-full items-center justify-center border-3 border-white">
                            <Camera size={18} color="#FFF" />
                        </View>
                    </Pressable>
                    <Text className="text-sm text-gray-500 mt-3">Toque para alterar</Text>
                </View>

                {/* Name */}
                <View className="mb-5">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">Nome</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Seu nome"
                        className="border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50"
                        maxLength={50}
                    />
                </View>

                {/* Bio */}
                <View className="mb-5">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">Bio</Text>
                    <TextInput
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Conte um pouco sobre você..."
                        className="border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50"
                        multiline
                        numberOfLines={3}
                        maxLength={200}
                        textAlignVertical="top"
                        style={{ minHeight: 80 }}
                    />
                    <Text className="text-xs text-gray-400 mt-1 text-right">{bio.length}/200</Text>
                </View>

                {/* Location */}
                <View className="mb-5">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">Localização</Text>
                    <TextInput
                        value={location}
                        onChangeText={setLocation}
                        placeholder="São Paulo, SP"
                        className="border border-gray-200 rounded-xl px-4 py-3 text-base bg-gray-50"
                        maxLength={100}
                    />
                </View>

                {/* Sports */}
                <View className="mb-8">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Esportes favoritos (até 3)
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                        {SPORTS_OPTIONS.map(sport => {
                            const isSelected = selectedSports.includes(sport.id);
                            return (
                                <Pressable
                                    key={sport.id}
                                    onPress={() => toggleSport(sport.id)}
                                    className={`flex-row items-center gap-2 px-4 py-2.5 rounded-full border ${
                                        isSelected
                                            ? 'bg-black border-black'
                                            : 'bg-white border-gray-200'
                                    }`}
                                >
                                    <Text className="text-lg">{sport.icon}</Text>
                                    <Text className={`font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                                        {sport.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Privacy Note */}
                <View className="bg-gray-50 rounded-xl p-4 mb-8">
                    <Text className="text-sm text-gray-600 text-center">
                        🔒 Suas informações são visíveis para outros usuários do Kourt
                    </Text>
                </View>

            </ScrollView>

            {/* Footer */}
            <View className="px-5 py-4 border-t border-gray-100" style={{ paddingBottom: insets.bottom + 16 }}>
                <Pressable
                    onPress={handleSave}
                    disabled={saving}
                    className={`w-full h-14 rounded-2xl items-center justify-center ${saving ? 'bg-gray-300' : 'bg-black'}`}
                >
                    {saving ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text className="text-white font-bold text-base">Salvar Alterações</Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}
