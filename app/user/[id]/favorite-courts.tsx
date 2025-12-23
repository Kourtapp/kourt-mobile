import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Star, Heart, Clock } from 'lucide-react-native';
import { supabase } from '../../../lib/supabase';
import { SportIcon, getSportIcon } from '../../../components/SportIcon';

interface FavoriteCourt {
  id: string;
  name: string;
  address: string;
  image?: string;
  rating: number;
  reviewCount: number;
  sport: string;
  sportEmoji: string;
  timesPlayed: number;
  lastPlayed: string;
  distance?: string;
  isFavorite: boolean;
}

const DEMO_COURTS: FavoriteCourt[] = [
  {
    id: '1',
    name: 'Beach Arena SP',
    address: 'Av. Paulista, 1000 - São Paulo',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
    rating: 4.8,
    reviewCount: 127,
    sport: 'Beach Tennis',
    sportEmoji: '🎾',
    timesPlayed: 23,
    lastPlayed: 'Hoje',
    distance: '2.5 km',
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Padel Club Ibirapuera',
    address: 'Rua Ibirapuera, 500 - São Paulo',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400',
    rating: 4.6,
    reviewCount: 89,
    sport: 'Padel',
    sportEmoji: '🏸',
    timesPlayed: 15,
    lastPlayed: 'Ontem',
    distance: '4.2 km',
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Arena Beach Tennis',
    address: 'Av. Brasil, 2000 - São Paulo',
    image: 'https://images.unsplash.com/photo-1560012057-4372e14c5085?w=400',
    rating: 4.9,
    reviewCount: 234,
    sport: 'Beach Tennis',
    sportEmoji: '🎾',
    timesPlayed: 12,
    lastPlayed: '3 dias atrás',
    distance: '6.8 km',
    isFavorite: true,
  },
  {
    id: '4',
    name: 'Padel House',
    address: 'Rua Augusta, 1500 - São Paulo',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400',
    rating: 4.5,
    reviewCount: 56,
    sport: 'Padel',
    sportEmoji: '🏸',
    timesPlayed: 8,
    lastPlayed: 'Semana passada',
    distance: '3.1 km',
    isFavorite: true,
  },
  {
    id: '5',
    name: 'Tennis Club São Paulo',
    address: 'Rua Oscar Freire, 800 - São Paulo',
    image: 'https://images.unsplash.com/photo-1551773188-0801da12ddae?w=400',
    rating: 4.7,
    reviewCount: 145,
    sport: 'Tênis',
    sportEmoji: '🎾',
    timesPlayed: 5,
    lastPlayed: '2 semanas atrás',
    distance: '5.5 km',
    isFavorite: true,
  },
];

export default function FavoriteCourtsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    checkIfOwnProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const checkIfOwnProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsOwnProfile(user?.id === id);
  };

  const totalMatches = DEMO_COURTS.reduce((sum, court) => sum + court.timesPlayed, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={24} color="#111827" />
        </Pressable>
        <Text style={{ flex: 1, fontSize: 18, fontWeight: '600', color: '#111827', textAlign: 'center', marginRight: 40 }}>
          Quadras Favoritas
        </Text>
      </View>

      {/* Summary */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, gap: 12 }}>
        <View style={{ flex: 1, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{DEMO_COURTS.length}</Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>Quadras</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{totalMatches}</Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>Partidas</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#F97316' }}>4.7</Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>Média</Text>
        </View>
      </View>

      {/* Courts List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          {DEMO_COURTS.map((court, index) => (
            <Pressable
              key={court.id}
              onPress={() => router.push(`/court/${court.id}` as any)}
              style={{
                backgroundColor: '#FAFAFA',
                borderRadius: 16,
                marginBottom: 12,
                overflow: 'hidden',
              }}
            >
              {/* Image */}
              {court.image && (
                <Image
                  source={{ uri: court.image }}
                  style={{ width: '100%', height: 140 }}
                  resizeMode="cover"
                />
              )}

              {/* Content */}
              <View style={{ padding: 16 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>{court.name}</Text>
                      <View style={{
                        marginLeft: 8,
                        backgroundColor: '#111827',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                        {getSportIcon(court.sport) ? (
                          <SportIcon sport={court.sport} size={14} showBackground={false} />
                        ) : (
                          <Text style={{ fontSize: 11 }}>{court.sportEmoji}</Text>
                        )}
                        <Text style={{ fontSize: 11, color: '#fff' }}>{court.sport}</Text>
                      </View>
                    </View>
                    {isOwnProfile && (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 4, flex: 1 }} numberOfLines={1}>
                          {court.address}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Heart size={20} color="#EF4444" fill="#EF4444" />
                </View>

                {/* Stats Row */}
                <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#111827', marginLeft: 4 }}>{court.rating}</Text>
                    <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 2 }}>({court.reviewCount})</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, color: '#6B7280' }}>🎾 {court.timesPlayed}x jogado</Text>
                  </View>

                  {/* Distance only on own profile */}
                  {isOwnProfile && court.distance && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MapPin size={12} color="#6B7280" />
                      <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 4 }}>{court.distance}</Text>
                    </View>
                  )}
                </View>

                {/* Last Played - only on own profile for privacy */}
                {isOwnProfile && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 6 }}>
                      Última partida: {court.lastPlayed}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))}

          {DEMO_COURTS.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>📍</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
                Nenhuma quadra favorita
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
                Adicione quadras aos favoritos para vê-las aqui
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
