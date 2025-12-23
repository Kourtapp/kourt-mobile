import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Plus, Star, Boxes, Footprints, Briefcase, Glasses, Shirt, Calendar } from 'lucide-react-native';
import { SportIcon, getSportIcon } from '../../../components/SportIcon';

interface Equipment {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: 'racket' | 'shoes' | 'bag' | 'accessories' | 'clothing';
  image?: string;
  sport: string;
  sportKey: string;
  purchaseDate?: string;
  rating?: number;
  notes?: string;
  isCurrent: boolean;
}

const DEMO_EQUIPMENT: Equipment[] = [
  {
    id: '1',
    name: 'Raquete Principal',
    brand: 'Head',
    model: 'Radical Pro',
    category: 'racket',
    image: 'https://images.unsplash.com/photo-1617083934555-ac7b4d0c8be9?w=400',
    sport: 'Beach Tennis',
    sportKey: 'beach-tennis',
    purchaseDate: 'Mar 2024',
    rating: 5,
    notes: 'Peso: 340g, Balance: 32cm',
    isCurrent: true,
  },
  {
    id: '2',
    name: 'Raquete Reserva',
    brand: 'Babolat',
    model: 'Pure Drive',
    category: 'racket',
    sport: 'Beach Tennis',
    sportKey: 'beach-tennis',
    purchaseDate: 'Jan 2024',
    rating: 4,
    isCurrent: true,
  },
  {
    id: '3',
    name: 'Raquete de Padel',
    brand: 'Bullpadel',
    model: 'Vertex 03',
    category: 'racket',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400',
    sport: 'Padel',
    sportKey: 'padel',
    purchaseDate: 'Jun 2024',
    rating: 5,
    notes: 'Controle excelente',
    isCurrent: true,
  },
  {
    id: '4',
    name: 'Tênis',
    brand: 'Nike',
    model: 'Air Zoom Vapor Pro 2',
    category: 'shoes',
    sport: 'Beach Tennis',
    sportKey: 'beach-tennis',
    purchaseDate: 'Abr 2024',
    rating: 4,
    notes: 'Tamanho 42',
    isCurrent: true,
  },
  {
    id: '5',
    name: 'Bolsa de Raquetes',
    brand: 'Wilson',
    model: 'Super Tour 9 Pack',
    category: 'bag',
    sport: 'Geral',
    sportKey: 'general',
    purchaseDate: 'Fev 2024',
    isCurrent: true,
  },
  {
    id: '6',
    name: 'Óculos de Sol',
    brand: 'Oakley',
    model: 'Radar EV',
    category: 'accessories',
    sport: 'Beach Tennis',
    sportKey: 'beach-tennis',
    purchaseDate: 'Mai 2024',
    rating: 5,
    isCurrent: true,
  },
];

const CATEGORIES = [
  { key: 'all', label: 'Todos', icon: 'all' },
  { key: 'racket', label: 'Raquetes', icon: 'racket' },
  { key: 'shoes', label: 'Calçados', icon: 'shoes' },
  { key: 'bag', label: 'Bolsas', icon: 'bag' },
  { key: 'accessories', label: 'Acessórios', icon: 'accessories' },
];

export default function EquipmentScreen() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id } = useLocalSearchParams<{ id: string }>();
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredEquipment = DEMO_EQUIPMENT.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const renderCategoryIcon = (category: string, color: string, size: number = 18) => {
    switch (category) {
      case 'racket': return <SportIcon sport="beach-tennis" size={size} showBackground={false} />;
      case 'shoes': return <Footprints size={size} color={color} />;
      case 'bag': return <Briefcase size={size} color={color} />;
      case 'accessories': return <Glasses size={size} color={color} />;
      case 'clothing': return <Shirt size={size} color={color} />;
      default: return <Boxes size={size} color={color} />;
    }
  };

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
        <Text style={{ flex: 1, fontSize: 18, fontWeight: '600', color: '#111827', textAlign: 'center' }}>
          Equipamento
        </Text>
        <Pressable
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={24} color="#111827" />
        </Pressable>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.key;
          return (
            <Pressable
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: isSelected ? '#111827' : '#F3F4F6',
                gap: 6,
              }}
            >
              {renderCategoryIcon(category.key, isSelected ? '#fff' : '#6B7280', 16)}
              <Text style={{ fontSize: 14, fontWeight: '500', color: isSelected ? '#fff' : '#6B7280' }}>
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Equipment List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          {/* Summary */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 1, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>{DEMO_EQUIPMENT.length}</Text>
              <Text style={{ fontSize: 13, color: '#6B7280' }}>Itens</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
                {DEMO_EQUIPMENT.filter(e => e.category === 'racket').length}
              </Text>
              <Text style={{ fontSize: 13, color: '#6B7280' }}>Raquetes</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#FAFAFA', borderRadius: 12, padding: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>2</Text>
              <Text style={{ fontSize: 13, color: '#6B7280' }}>Esportes</Text>
            </View>
          </View>

          {/* Current Equipment Section */}
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
            Equipamento Atual
          </Text>

          {filteredEquipment.map((item, index) => (
            <Pressable
              key={item.id}
              style={{
                backgroundColor: '#FAFAFA',
                borderRadius: 16,
                marginBottom: 12,
                overflow: 'hidden',
              }}
            >
              <View style={{ flexDirection: 'row', padding: 16 }}>
                {/* Image or Icon */}
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                  overflow: 'hidden',
                }}>
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  ) : (
                    renderCategoryIcon(item.category, '#6B7280', 32)
                  )}
                </View>

                {/* Content */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', flex: 1 }}>
                      {item.brand} {item.model}
                    </Text>
                    {item.isCurrent && (
                      <View style={{ backgroundColor: '#22C55E', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                        <Text style={{ fontSize: 10, fontWeight: '600', color: '#fff' }}>ATUAL</Text>
                      </View>
                    )}
                  </View>

                  <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>{item.name}</Text>

                  {/* Sport Tag */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <View style={{
                      backgroundColor: '#111827',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                      {getSportIcon(item.sportKey) ? (
                        <SportIcon sport={item.sportKey} size={16} showBackground={false} />
                      ) : (
                        <Text style={{ fontSize: 11 }}>🎾</Text>
                      )}
                      <Text style={{ fontSize: 11, color: '#fff' }}>{item.sport}</Text>
                    </View>
                  </View>

                  {/* Rating and Date */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    {item.rating && (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            color="#F59E0B"
                            fill={star <= item.rating! ? '#F59E0B' : 'transparent'}
                          />
                        ))}
                      </View>
                    )}
                    {item.purchaseDate && (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Calendar size={12} color="#6B7280" />
                        <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}>{item.purchaseDate}</Text>
                      </View>
                    )}
                  </View>

                  {/* Notes */}
                  {item.notes && (
                    <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 8, fontStyle: 'italic' }}>
                      {item.notes}
                    </Text>
                  )}
                </View>
              </View>
            </Pressable>
          ))}

          {filteredEquipment.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <View style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <SportIcon sport="beach-tennis" size={48} showBackground={false} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
                Nenhum equipamento
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
                Adicione seu equipamento para acompanhar
              </Text>
            </View>
          )}

          {/* Add Equipment Button */}
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#111827',
              paddingVertical: 16,
              borderRadius: 12,
              marginTop: 8,
              gap: 8,
            }}
          >
            <Plus size={20} color="#fff" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Adicionar Equipamento</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
