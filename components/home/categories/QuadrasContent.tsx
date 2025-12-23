import { View, ScrollView, Text } from 'react-native';
import { router } from 'expo-router';
import { CourtCard } from '../CourtCard';
import { SectionHeader } from '../SectionHeader';

interface QuadrasContentProps {
  nearbyCourts: any[];
  featuredCourts: any[];
}

export function QuadrasContent({ nearbyCourts, featuredCourts }: QuadrasContentProps) {
  return (
    <View>
      {/* Quadras Próximas */}
      {nearbyCourts.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <SectionHeader
            icon="map-pin"
            title="Quadras perto de você"
            subtitle="Baseado na sua localização atual"
            actionText="Ver mapa"
            onActionPress={() => router.push('/(tabs)/map')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 12 }}
          >
            {nearbyCourts.slice(0, 5).map((court) => (
              <CourtCard
                key={`nearby-${court.id}`}
                court={court}
                onPress={() => router.push(`/court/${court.id}` as any)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Melhores Avaliadas */}
      {featuredCourts.length > 0 && (
        <View style={{ marginTop: 12 }}>
          <SectionHeader
            icon="star"
            title="Melhores avaliadas"
            subtitle="As quadras mais bem avaliadas da região"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 8 }}
          >
            {featuredCourts.map((court) => (
              <CourtCard
                key={`featured-${court.id}`}
                court={court}
                onPress={() => router.push(`/court/${court.id}` as any)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Populares Agora */}
      {nearbyCourts.length > 2 && (
        <View style={{ marginTop: 12 }}>
          <SectionHeader
            icon="trending-up"
            title="Populares agora"
            subtitle="Quadras com maior movimento"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 8 }}
          >
            {nearbyCourts.slice(2, 7).map((court) => (
              <CourtCard
                key={`popular-${court.id}`}
                court={court}
                onPress={() => router.push(`/court/${court.id}` as any)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Empty State */}
      {nearbyCourts.length === 0 && featuredCourts.length === 0 && (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🏟️</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Nenhuma quadra encontrada
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
            Não encontramos quadras perto de você. Tente expandir a área de busca.
          </Text>
        </View>
      )}
    </View>
  );
}
