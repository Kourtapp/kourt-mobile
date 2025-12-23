import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useProfessionals, ServiceCategory } from '../../../hooks/useProfessionals';

const serviceOptions: { category: ServiceCategory; label: string; icon: string; description: string }[] = [
  {
    category: 'personal_trainer',
    label: 'Personal Trainer',
    icon: '💪',
    description: 'Treinos personalizados e acompanhamento físico',
  },
  {
    category: 'sports_coach',
    label: 'Treinador Esportivo',
    icon: '🎾',
    description: 'Aulas e treinamento técnico de esportes',
  },
  {
    category: 'nutritionist',
    label: 'Nutricionista',
    icon: '🥗',
    description: 'Planejamento alimentar e dietas esportivas',
  },
  {
    category: 'physiotherapist',
    label: 'Fisioterapeuta',
    icon: '🏥',
    description: 'Reabilitação e prevenção de lesões',
  },
  {
    category: 'masseuse',
    label: 'Massagista',
    icon: '💆',
    description: 'Massagem desportiva e relaxamento',
  },
];

export default function ProfessionalSetup() {
  const [selectedServices, setSelectedServices] = useState<ServiceCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const { createProfessional, professional } = useProfessionals();

  const toggleService = (category: ServiceCategory) => {
    setSelectedServices((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = async () => {
    if (selectedServices.length === 0) {
      return;
    }

    try {
      setSaving(true);

      if (!professional) {
        await createProfessional({
          specialties: selectedServices,
          is_active: false,
        });
      }

      router.push('/host/professionals/profile');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

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
          Serviços Profissionais
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
          Quais serviços você oferece?
        </Text>
        <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 32 }}>
          Selecione os tipos de serviços profissionais que você deseja oferecer na plataforma
        </Text>

        <View style={{ gap: 16 }}>
          {serviceOptions.map((option) => {
            const isSelected = selectedServices.includes(option.category);

            return (
              <TouchableOpacity
                key={option.category}
                onPress={() => toggleService(option.category)}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: isSelected ? '#3B82F6' : '#E5E7EB',
                  backgroundColor: isSelected ? '#EFF6FF' : 'white',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 40, marginRight: 16 }}>{option.icon}</Text>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: isSelected ? '#1D4ED8' : '#111827',
                      marginBottom: 4,
                    }}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: isSelected ? '#3B82F6' : '#6B7280',
                    }}
                  >
                    {option.description}
                  </Text>
                </View>

                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: isSelected ? '#3B82F6' : '#D1D5DB',
                    backgroundColor: isSelected ? '#3B82F6' : 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && <Check size={16} color="white" />}
                </View>
              </TouchableOpacity>
            );
          })}
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
          onPress={handleContinue}
          disabled={selectedServices.length === 0 || saving}
          style={{
            backgroundColor: selectedServices.length === 0 ? '#D1D5DB' : '#3B82F6',
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
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
              Continuar ({selectedServices.length} selecionado{selectedServices.length !== 1 ? 's' : ''})
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
