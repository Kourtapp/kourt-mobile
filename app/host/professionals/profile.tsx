import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProfessionals } from '../../../hooks/useProfessionals';
import { useAuthStore } from '../../../stores/authStore';

export default function ProfessionalProfile() {
  const { user } = useAuthStore();
  const { professional, updateProfessional, loading } = useProfessionals();
  const [saving, setSaving] = useState(false);

  const [bio, setBio] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (professional) {
      setBio(professional.bio || '');
      setQualifications(professional.qualifications || '');
      setProfileImage(professional.profile_image_url);
    }
  }, [professional]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateProfessional({
        bio: bio.trim() || null,
        qualifications: qualifications.trim() || null,
        profile_image_url: profileImage,
      });

      router.push('/host/professionals/services');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const userName = user?.user_metadata?.name || 'Profissional';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#F3F4F6',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color="#374151" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '600',
            color: '#111827',
            marginRight: 40,
          }}
        >
          Perfil Profissional
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
          Complete seu perfil
        </Text>
        <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 32 }}>
          Adicione informações que ajudam clientes a conhecer você melhor
        </Text>

        {/* Profile Image */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <TouchableOpacity onPress={pickImage} style={{ position: 'relative' }}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: '#F3F4F6',
                }}
              />
            ) : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: '#F3F4F6',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={48} color="#9CA3AF" />
              </View>
            )}

            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#3B82F6',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: 'white',
              }}
            >
              <Camera size={18} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={{ marginTop: 12, fontSize: 18, fontWeight: '600', color: '#111827' }}>
            {userName}
          </Text>
        </View>

        {/* Bio */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Sobre você
          </Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Conte um pouco sobre sua experiência e especialidades..."
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: '#F9FAFB',
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: '#111827',
              textAlignVertical: 'top',
              minHeight: 120,
            }}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Qualifications */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Qualificações e Certificações
          </Text>
          <TextInput
            value={qualifications}
            onChangeText={setQualifications}
            placeholder="Ex: CREF 123456-G/SP, Pós-graduação em Fisiologia do Exercício..."
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: '#F9FAFB',
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              color: '#111827',
              textAlignVertical: 'top',
              minHeight: 100,
            }}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Info */}
        <View
          style={{
            backgroundColor: '#FEF3C7',
            padding: 16,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <Text style={{ fontSize: 20, marginRight: 12 }}>💡</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#92400E', marginBottom: 4 }}>
              Dica
            </Text>
            <Text style={{ fontSize: 14, color: '#A16207' }}>
              Um perfil completo aumenta em até 3x as chances de conseguir novos clientes.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        style={{
          padding: 24,
          paddingBottom: 32,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving || loading}
          style={{
            backgroundColor: '#3B82F6',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Continuar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
