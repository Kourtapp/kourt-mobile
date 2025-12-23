import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

export type BusinessModuleId = 'quadras' | 'torneios' | 'profissionais';

export interface BusinessModule {
  id: BusinessModuleId;
  title: string;
  subtitle: string;
  icon: any;
  metrics?: string;
  status: 'Ativo' | 'Configurar';
  isNew?: boolean;
  route: string;
}

interface BusinessCardProps {
  module: BusinessModule;
}

export default function BusinessCard({ module }: BusinessCardProps) {
  const isConfigurable = module.status === 'Configurar';

  return (
    <TouchableOpacity
      onPress={() => router.push(module.route as any)}
      style={{
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: isConfigurable ? 2 : 0,
        borderColor: isConfigurable ? '#DBEAFE' : 'transparent',
      }}
      activeOpacity={0.7}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={module.icon}
          style={{ width: 80, height: 80, marginRight: 16 }}
          resizeMode="contain"
        />
        {module.isNew && (
          <View style={{
            position: 'absolute',
            top: -4,
            left: -4,
            backgroundColor: '#3B82F6',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>NOVO</Text>
          </View>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 11,
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 4,
        }}>
          {module.id}
        </Text>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: 4,
        }}>
          {module.title}
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#6B7280',
        }}>
          {module.subtitle}
        </Text>
        {module.metrics && (
          <Text style={{
            fontSize: 12,
            color: '#9CA3AF',
            marginTop: 4,
          }}>
            {module.metrics}
          </Text>
        )}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: module.status === 'Ativo' ? '#DCFCE7' : '#FED7AA',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: module.status === 'Ativo' ? '#15803D' : '#C2410C',
            }}
          >
            {module.status}
          </Text>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}
