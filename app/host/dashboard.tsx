import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import BusinessCard, { BusinessModule } from '../../components/host/BusinessCard';

const modules: BusinessModule[] = [
  {
    id: 'quadras',
    title: 'Gestão de Quadras',
    subtitle: '3 quadras ativas',
    icon: require('../../assets/icons/3d/quadras.png'),
    metrics: 'R$ 12.450/mês • 85% ocupação',
    status: 'Ativo',
    route: '/court/my-listings',
  },
  {
    id: 'torneios',
    title: 'Gestão de Torneios',
    subtitle: '2 torneios em andamento',
    icon: require('../../assets/icons/3d/torneios.png'),
    metrics: '48 inscritos • R$ 3.200 arrecadado',
    status: 'Ativo',
    route: '/tournament/manage',
  },
  {
    id: 'profissionais',
    title: 'Gestão de Profissionais',
    subtitle: 'Configure seus serviços profissionais',
    icon: require('../../assets/icons/3d/profissionais.png'),
    status: 'Configurar',
    isNew: true,
    route: '/host/professionals/setup',
  },
];

export default function HostDashboard() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top']}>
      {/* Header */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827' }}>
          Kourt Host
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/settings' as any)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#F3F4F6',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Settings size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#111827', marginBottom: 4 }}>
          Olá, {user?.user_metadata?.name?.split(' ')[0] || 'Bruno'} 👋
        </Text>
        <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 24 }}>
          Gerencie seus negócios esportivos
        </Text>

        {/* Section Title */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
          Meus Negócios
        </Text>

        {/* Business Cards */}
        {modules.map((module) => (
          <BusinessCard key={module.id} module={module} />
        ))}

        {/* Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
