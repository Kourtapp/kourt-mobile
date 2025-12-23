import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Star, MapPin, ChevronRight, Briefcase } from 'lucide-react-native';

interface Professional {
  id: string;
  name: string;
  avatar_url?: string;
  category: string;
  rating: number;
  reviews_count: number;
  price_per_hour: number;
  location: string;
  specialties: string[];
  is_verified: boolean;
}

// Demo professionals for now
const demoProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
    category: 'sports_coach',
    rating: 4.9,
    reviews_count: 127,
    price_per_hour: 15000,
    location: 'Moema, São Paulo',
    specialties: ['Beach Tennis', 'Padel'],
    is_verified: true,
  },
  {
    id: '2',
    name: 'Ana Rodrigues',
    avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
    category: 'personal_trainer',
    rating: 4.8,
    reviews_count: 89,
    price_per_hour: 12000,
    location: 'Pinheiros, São Paulo',
    specialties: ['Preparação Física', 'Funcional'],
    is_verified: true,
  },
  {
    id: '3',
    name: 'Dr. Paulo Mendes',
    avatar_url: 'https://randomuser.me/api/portraits/men/45.jpg',
    category: 'physiotherapist',
    rating: 5.0,
    reviews_count: 203,
    price_per_hour: 25000,
    location: 'Itaim Bibi, São Paulo',
    specialties: ['Fisioterapia Esportiva', 'Reabilitação'],
    is_verified: true,
  },
  {
    id: '4',
    name: 'Fernanda Costa',
    avatar_url: 'https://randomuser.me/api/portraits/women/68.jpg',
    category: 'nutritionist',
    rating: 4.7,
    reviews_count: 56,
    price_per_hour: 18000,
    location: 'Vila Olímpia, São Paulo',
    specialties: ['Nutrição Esportiva', 'Emagrecimento'],
    is_verified: false,
  },
];

const categoryLabels: Record<string, { label: string; icon: string; color: string }> = {
  personal_trainer: { label: 'Personal Trainer', icon: '💪', color: '#EF4444' },
  sports_coach: { label: 'Treinador', icon: '🎾', color: '#3B82F6' },
  nutritionist: { label: 'Nutricionista', icon: '🥗', color: '#22C55E' },
  physiotherapist: { label: 'Fisioterapeuta', icon: '🏥', color: '#8B5CF6' },
  masseuse: { label: 'Massagista', icon: '💆', color: '#F59E0B' },
};

function ProfessionalCard({ professional }: { professional: Professional }) {
  const category = categoryLabels[professional.category] || {
    label: 'Profissional',
    icon: '👤',
    color: '#6B7280',
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/professional/${professional.id}` as any)}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: 'row' }}>
        {/* Avatar */}
        <View style={{ position: 'relative' }}>
          {professional.avatar_url ? (
            <Image
              source={{ uri: professional.avatar_url }}
              style={{ width: 64, height: 64, borderRadius: 32 }}
            />
          ) : (
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: '#F3F4F6',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 28 }}>{category.icon}</Text>
            </View>
          )}

          {professional.is_verified && (
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: '#3B82F6',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: 'white',
              }}
            >
              <Text style={{ fontSize: 10 }}>✓</Text>
            </View>
          )}
        </View>

        <View style={{ flex: 1, marginLeft: 12 }}>
          {/* Category Badge */}
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: `${category.color}15`,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 8,
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: category.color }}>
              {category.icon} {category.label}
            </Text>
          </View>

          {/* Name */}
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
            {professional.name}
          </Text>

          {/* Rating */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#111827', marginLeft: 4 }}>
              {professional.rating}
            </Text>
            <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}>
              ({professional.reviews_count} avaliações)
            </Text>
          </View>

          {/* Location */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MapPin size={12} color="#6B7280" />
            <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}>
              {professional.location}
            </Text>
          </View>
        </View>

        {/* Price */}
        <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#059669' }}>
            R$ {(professional.price_per_hour / 100).toFixed(0)}
          </Text>
          <Text style={{ fontSize: 11, color: '#6B7280' }}>/hora</Text>
        </View>
      </View>

      {/* Specialties */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
        {professional.specialties.map((specialty) => (
          <View
            key={specialty}
            style={{
              backgroundColor: '#F3F4F6',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 12, color: '#374151' }}>{specialty}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

export function ProfissionaisContent() {
  const categories = Object.entries(categoryLabels);

  return (
    <View>
      {/* Become a Professional CTA */}
      <TouchableOpacity
        onPress={() => router.push('/host/professionals/setup' as any)}
        style={{
          marginHorizontal: 20,
          marginTop: 16,
          backgroundColor: '#8B5CF6',
          borderRadius: 16,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        activeOpacity={0.8}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}
        >
          <Briefcase size={24} color="white" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: 'white', marginBottom: 4 }}>
            Seja um Profissional
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            Ofereça seus serviços na plataforma
          </Text>
        </View>
        <ChevronRight size={24} color="white" />
      </TouchableOpacity>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, gap: 8 }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: '#111827',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Todos</Text>
        </TouchableOpacity>
        {categories.map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={{
              backgroundColor: '#F3F4F6',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#374151', fontWeight: '500' }}>
              {value.icon} {value.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Professionals */}
      <View style={{ marginTop: 8 }}>
        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
            Profissionais em destaque
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>
            Os melhores avaliados da sua região
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {demoProfessionals.map((professional) => (
            <ProfessionalCard key={professional.id} professional={professional} />
          ))}
        </View>
      </View>

      {/* Empty State */}
      {demoProfessionals.length === 0 && (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>👨‍🏫</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Nenhum profissional disponível
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 20 }}>
            Seja o primeiro profissional a se cadastrar na sua região!
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/host/professionals/setup' as any)}
            style={{
              backgroundColor: '#8B5CF6',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Cadastrar-se</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
