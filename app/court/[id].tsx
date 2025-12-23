import { View, Text, ScrollView, Platform, Pressable, Image, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useState, useMemo, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Star, Clock, CheckCircle, XCircle, Calendar, Bell, Trophy, Users, Home } from 'lucide-react-native';

import { CourtHero, CourtHeroRef } from '../../components/court/CourtHero';
// import { AmenitiesList } from '../../components/court/AmenitiesList';
// import { BookingCalendar } from '../../components/court/BookingCalendar';
import { SchedulePreview } from '../../components/court/SchedulePreview';
import { CourtSelector } from '../../components/court/CourtSelector';
import { TopPlayers } from '../../components/court/TopPlayers';
import { useCourt } from '../../hooks/useCourts';
import { SportIcon } from '../../components/SportIcon';

// Generate next 7 days for date selector
function getNextDays(count: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  return days;
}

function formatDayName(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Hoje';
  if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã';

  return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
}

// Mock Reviews Data
const REVIEWS_BREAKDOWN = [
  { stars: 5, percentage: 70 },
  { stars: 4, percentage: 22 },
  { stars: 3, percentage: 5 },
  { stars: 2, percentage: 2 },
  { stars: 1, percentage: 1 },
];

// Mock bookings with people who already reserved
const MOCK_BOOKINGS: Record<number, { name: string; avatar: string }[]> = {
  8: [
    { name: 'Carlos', avatar: 'https://i.pravatar.cc/100?img=12' },
    { name: 'Ana', avatar: 'https://i.pravatar.cc/100?img=47' },
  ],
  9: [
    { name: 'João', avatar: 'https://i.pravatar.cc/100?img=33' },
  ],
  10: [
    { name: 'Marina', avatar: 'https://i.pravatar.cc/100?img=23' },
    { name: 'Pedro', avatar: 'https://i.pravatar.cc/100?img=53' },
    { name: 'Lucia', avatar: 'https://i.pravatar.cc/100?img=45' },
  ],
  18: [
    { name: 'Rafael', avatar: 'https://i.pravatar.cc/100?img=68' },
    { name: 'Fernanda', avatar: 'https://i.pravatar.cc/100?img=32' },
  ],
  19: [
    { name: 'Bruno', avatar: 'https://i.pravatar.cc/100?img=11' },
    { name: 'Carla', avatar: 'https://i.pravatar.cc/100?img=5' },
    { name: 'Thiago', avatar: 'https://i.pravatar.cc/100?img=59' },
    { name: 'Julia', avatar: 'https://i.pravatar.cc/100?img=21' },
  ],
  20: [
    { name: 'Lucas', avatar: 'https://i.pravatar.cc/100?img=15' },
  ],
};

const REVIEWS = [
  {
    id: 1,
    name: 'Pedro Ferreira',
    date: 'Novembro 2024',
    rating: 5.0,
    comment: 'Quadra excelente! Areia de ótima qualidade e iluminação perfeita para jogos noturnos. Vestiário limpo e bem equipado. Super recomendo!',
    avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Marina Santos',
    date: 'Outubro 2024',
    rating: 4.5,
    comment: 'Ótima quadra, só achei o estacionamento um pouco cheio no horário de pico. Mas a estrutura compensa!',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'
  }
];

// Mock courts in the same arena (when arena has multiple courts)
const ARENA_COURTS = [
  { id: '1', name: 'Quadra 1', sport: 'Beach Tennis', price: 180, image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400', covered: false, surface: 'Areia' },
  { id: '2', name: 'Quadra 2', sport: 'Beach Tennis', price: 180, image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400', covered: true, surface: 'Areia' },
  { id: '3', name: 'Quadra 3', sport: 'Padel', price: 200, image: 'https://images.unsplash.com/photo-1612534847738-b3af9bc31f0c?w=400', covered: true, surface: 'Sintético' },
];

// Mock recent results
const RECENT_RESULTS = [
  {
    id: '1',
    date: '20 Dez',
    time: '18:00',
    team1: { players: ['Carlos M.', 'Ana P.'], score: 6 },
    team2: { players: ['Pedro F.', 'Marina S.'], score: 4 },
  },
  {
    id: '2',
    date: '19 Dez',
    time: '10:00',
    team1: { players: ['João R.', 'Lucia C.'], score: 3 },
    team2: { players: ['Bruno L.', 'Carla T.'], score: 6 },
  },
  {
    id: '3',
    date: '18 Dez',
    time: '20:00',
    team1: { players: ['Rafael O.', 'Julia M.'], score: 6 },
    team2: { players: ['Thiago S.', 'Fernanda R.'], score: 2 },
  },
];

// Opening hours
const OPENING_HOURS = [
  { day: 'Segunda', hours: '06:00 - 22:00' },
  { day: 'Terça', hours: '06:00 - 22:00' },
  { day: 'Quarta', hours: '06:00 - 22:00' },
  { day: 'Quinta', hours: '06:00 - 22:00' },
  { day: 'Sexta', hours: '06:00 - 23:00' },
  { day: 'Sábado', hours: '07:00 - 23:00' },
  { day: 'Domingo', hours: '07:00 - 20:00' },
];

// Tab options
type TabType = 'home' | 'book' | 'matches' | 'tournaments';

export default function CourtDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { court, loading } = useCourt(id as string);
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCourtId, setSelectedCourtId] = useState<string>(id as string);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showAllHours, setShowAllHours] = useState(false);

  // Ref for CourtHero to enable scroll to photo on court select
  const heroRef = useRef<CourtHeroRef>(null);

  // Build labeled images from ARENA_COURTS for the hero carousel
  const heroImages = useMemo(() => {
    return ARENA_COURTS.map(c => ({
      url: c.image,
      label: c.name, // "Quadra 1", "Quadra 2", etc.
    }));
  }, []);

  // Handle court selection and scroll hero to corresponding photo
  const handleCourtSelect = (courtId: string) => {
    setSelectedCourtId(courtId);
    const index = ARENA_COURTS.findIndex(c => c.id === courtId);
    if (index !== -1) {
      heroRef.current?.scrollToIndex(index);
    }
  };

  // Check if arena has multiple courts (mock - in real app, fetch from backend)
  const hasMultipleCourts = !court?.type || court?.type === 'private';

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10, color: '#666' }}>Carregando quadra...</Text>
      </View>
    );
  }

  const images = (court?.images && court.images.length > 0) ? court.images : (court?.image ? [court.image] : []);
  const canBook = selectedTime !== null;

  if (!court) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Quadra não encontrada</Text>
        <Text style={{ marginTop: 8, color: '#666' }}>ID: {id}</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, padding: 10 }}>
          <Text style={{ color: 'blue' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isPublic = court.type === 'public' || !court.price;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <CourtHero
          ref={heroRef}
          images={hasMultipleCourts ? heroImages : images}
          isFavorite={false}
          onToggleFavorite={() => { }}
          onShare={() => { }}
        />

        <View style={{ padding: 20 }}>
          {/* Header Info */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>
                {court.sport} · {isPublic ? 'Pública' : 'Quadra 3'}
              </Text>
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#000', marginBottom: 8, lineHeight: 32 }}>
                {court.name}
              </Text>
            </View>
            {isPublic && (
              <View style={{ backgroundColor: '#DBEAFE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                <Text style={{ color: '#1E40AF', fontWeight: '700', fontSize: 12 }}>GRÁTIS</Text>
              </View>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Star size={18} color="#000" fill="#000" />
            <Text style={{ fontSize: 15, fontWeight: '700', marginLeft: 4 }}>4.8</Text>
            {/* ... Existing Review Text ... */}
            <Text style={{ fontSize: 15, color: '#6B7280', textDecorationLine: 'underline', marginLeft: 4 }}>
              124 avaliações
            </Text>
            <Text style={{ fontSize: 15, color: '#6B7280', marginHorizontal: 6 }}>·</Text>
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#374151' }}>{court.city || 'São Paulo, SP'}</Text>
          </View>

          {/* ... Location Pin Row ... */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MapPin size={16} color="#6B7280" />
            <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 4 }}>
              {court.address}
            </Text>
          </View>

          {/* Tabs Navigation */}
          <View style={{ marginTop: 20 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 0 }}
            >
              {[
                { key: 'home', label: 'Início', icon: Home },
                { key: 'book', label: 'Reservar', icon: Calendar },
                { key: 'matches', label: 'Partidas', icon: Users },
                { key: 'tournaments', label: 'Torneios', icon: Trophy },
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                const IconComponent = tab.icon;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key as TabType)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderBottomWidth: 2,
                      borderBottomColor: isActive ? '#000' : 'transparent',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <IconComponent size={16} color={isActive ? '#000' : '#9CA3AF'} />
                    <Text style={{
                      fontSize: 14,
                      fontWeight: isActive ? '700' : '500',
                      color: isActive ? '#000' : '#9CA3AF',
                    }}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />
          </View>

          <View style={{ height: 20 }} />

          {/* ===== HOME TAB ===== */}
          {activeTab === 'home' && (
            <>
              {/* Court Selector - Shows when arena has multiple courts */}
              {hasMultipleCourts && (
                <CourtSelector
                  courts={ARENA_COURTS}
                  selectedCourtId={selectedCourtId}
                  onSelectCourt={handleCourtSelect}
                />
              )}

              {/* Recent Results Section */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                  Resultados recentes
                </Text>
                <View style={{ gap: 12 }}>
                  {RECENT_RESULTS.map((result) => {
                    const team1Won = result.team1.score > result.team2.score;
                    return (
                      <View
                        key={result.id}
                        style={{
                          backgroundColor: '#F9FAFB',
                          borderRadius: 12,
                          padding: 14,
                          borderWidth: 1,
                          borderColor: '#F3F4F6',
                        }}
                      >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <Text style={{ fontSize: 12, color: '#6B7280' }}>{result.date} · {result.time}</Text>
                          <View style={{ backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                            <Text style={{ fontSize: 10, fontWeight: '600', color: '#1E40AF' }}>Beach Tennis</Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {/* Team 1 */}
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 13, fontWeight: team1Won ? '700' : '500', color: team1Won ? '#000' : '#6B7280' }}>
                              {result.team1.players.join(' / ')}
                            </Text>
                          </View>
                          {/* Score */}
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 }}>
                            <View style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              backgroundColor: team1Won ? '#22C55E' : '#E5E7EB',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <Text style={{ fontSize: 16, fontWeight: '800', color: team1Won ? '#FFF' : '#6B7280' }}>
                                {result.team1.score}
                              </Text>
                            </View>
                            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>x</Text>
                            <View style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              backgroundColor: !team1Won ? '#22C55E' : '#E5E7EB',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <Text style={{ fontSize: 16, fontWeight: '800', color: !team1Won ? '#FFF' : '#6B7280' }}>
                                {result.team2.score}
                              </Text>
                            </View>
                          </View>
                          {/* Team 2 */}
                          <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 13, fontWeight: !team1Won ? '700' : '500', color: !team1Won ? '#000' : '#6B7280', textAlign: 'right' }}>
                              {result.team2.players.join(' / ')}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
                <TouchableOpacity style={{ marginTop: 12, alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280', textDecorationLine: 'underline' }}>
                    Ver todos os resultados
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 1, backgroundColor: '#F3F4F6', marginBottom: 24 }} />

              {/* Opening Hours Section */}
              <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>
                    Horário de funcionamento
                  </Text>
                  <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#166534' }}>Aberto agora</Text>
                  </View>
                </View>
                <View style={{ gap: 8 }}>
                  {(showAllHours ? OPENING_HOURS : OPENING_HOURS.slice(0, 3)).map((item, index) => {
                    const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
                    const isToday = today.toLowerCase().startsWith(item.day.toLowerCase().slice(0, 3));
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          backgroundColor: isToday ? '#F0FDF4' : 'transparent',
                          borderRadius: 8,
                        }}
                      >
                        <Text style={{ fontSize: 14, fontWeight: isToday ? '700' : '500', color: isToday ? '#166534' : '#374151' }}>
                          {item.day}
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: isToday ? '#166534' : '#000' }}>
                          {item.hours}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                {!showAllHours && (
                  <TouchableOpacity
                    onPress={() => setShowAllHours(true)}
                    style={{ marginTop: 8, alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280' }}>
                      Ver todos os dias ↓
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={{ height: 1, backgroundColor: '#F3F4F6', marginBottom: 24 }} />

              {/* Club Account Section */}
              <View style={{ marginBottom: 24 }}>
                <View style={{
                  backgroundColor: '#FEF3C7',
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: '#FCD34D',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <View style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: '#FBBF24',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Star size={22} color="#FFF" fill="#FFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: '#92400E' }}>
                        Você tem conta neste clube?
                      </Text>
                      <Text style={{ fontSize: 13, color: '#A16207', marginTop: 2 }}>
                        Vincule sua conta e ganhe benefícios
                      </Text>
                    </View>
                  </View>
                  <View style={{ gap: 8, marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={16} color="#16A34A" />
                      <Text style={{ fontSize: 13, color: '#78350F' }}>Reservas com desconto de 10%</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={16} color="#16A34A" />
                      <Text style={{ fontSize: 13, color: '#78350F' }}>Prioridade na agenda de horários</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={16} color="#16A34A" />
                      <Text style={{ fontSize: 13, color: '#78350F' }}>Acesso a torneios exclusivos</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={{
                    backgroundColor: '#000',
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: 'center',
                  }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFF' }}>
                      Vincular minha conta
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: '#F3F4F6', marginBottom: 24 }} />

              {/* Priority Alerts Section */}
              <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>
                    Alertas de disponibilidade
                  </Text>
                </View>
                <View style={{
                  backgroundColor: '#F0F9FF',
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#BAE6FD',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#0EA5E9',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Bell size={20} color="#FFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#0C4A6E' }}>
                        Receba alertas
                      </Text>
                      <Text style={{ fontSize: 13, color: '#0369A1', marginTop: 4 }}>
                        Te avisamos quando abrir vaga no horário que você quer. Perfeito para horários concorridos!
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={{
                    backgroundColor: '#0EA5E9',
                    borderRadius: 10,
                    paddingVertical: 12,
                    alignItems: 'center',
                    marginTop: 16,
                  }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFF' }}>
                      Configurar alertas
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: '#F3F4F6', marginBottom: 24 }} />

              {/* Top Players */}
              <TopPlayers />

              <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 24 }} />
            </>
          )}

          {/* ===== BOOK TAB ===== */}
          {activeTab === 'book' && (
            <>
              {/* Court Selector - Shows when arena has multiple courts */}
              {hasMultipleCourts && (
                <CourtSelector
                  courts={ARENA_COURTS}
                  selectedCourtId={selectedCourtId}
                  onSelectCourt={handleCourtSelect}
                />
              )}

              {/* Date Selector - Shows for ALL courts */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                  Escolha o dia
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10 }}
                >
                  {getNextDays(7).map((date, index) => {
                    const isSelected = selectedDate.toDateString() === date.toDateString();
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedDate(date)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: 12,
                          backgroundColor: isSelected ? '#000' : '#F3F4F6',
                          alignItems: 'center',
                          minWidth: 70,
                        }}
                      >
                        <Text style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: isSelected ? '#FFF' : '#6B7280',
                          textTransform: 'capitalize',
                        }}>
                          {formatDayName(date)}
                        </Text>
                        <Text style={{
                          fontSize: 20,
                          fontWeight: '800',
                          color: isSelected ? '#FFF' : '#000',
                          marginTop: 4,
                        }}>
                          {date.getDate()}
                        </Text>
                        <Text style={{
                          fontSize: 10,
                          color: isSelected ? 'rgba(255,255,255,0.7)' : '#9CA3AF',
                          textTransform: 'capitalize',
                        }}>
                          {date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Toggle for available slots */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F9FAFB',
                borderRadius: 12,
                padding: 14,
                marginBottom: 20,
              }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>
                  Mostrar apenas horários disponíveis
                </Text>
                <Switch
                  value={showAvailableOnly}
                  onValueChange={setShowAvailableOnly}
                  trackColor={{ false: '#D1D5DB', true: '#22C55E' }}
                  thumbColor="#FFF"
                />
              </View>

              {/* Hour Picker - Instagram style with yellow ring avatars */}
              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Clock size={20} color="#000" />
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>
                    Escolha o horário
                  </Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
                >
                  {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((hour) => {
                    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                    const isSelected = selectedTime === timeStr;
                    const bookings = MOCK_BOOKINGS[hour] || [];
                    const hasBookings = bookings.length > 0;

                    return (
                      <View key={hour} style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                          onPress={() => setSelectedTime(isSelected ? null : timeStr)}
                          accessible={true}
                          accessibilityRole="button"
                          accessibilityLabel={`Horário ${hour} horas${hasBookings ? ', já tem reservas' : ''}`}
                          accessibilityHint="Toque duas vezes para selecionar este horário"
                          accessibilityState={{ selected: isSelected }}
                          style={{
                            width: 56,  // Already meets 44x44 minimum ✅
                            height: 56,
                            borderRadius: 28,
                            backgroundColor: isSelected ? '#000' : (hasBookings ? '#FEF3C7' : '#F3F4F6'),
                            borderWidth: hasBookings ? 3 : 0,
                            borderColor: '#FBBF24',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: isSelected ? '#FFF' : '#000',
                          }}>
                            {hour}h
                          </Text>
                        </TouchableOpacity>

                        {/* Avatars with yellow ring for booked slots */}
                        {hasBookings && (
                          <View style={{
                            flexDirection: 'row',
                            marginTop: 8,
                            justifyContent: 'center',
                          }}>
                            {bookings.slice(0, 3).map((person, idx) => (
                              <View
                                key={idx}
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 12,
                                  borderWidth: 2,
                                  borderColor: '#FBBF24', // Yellow ring
                                  marginLeft: idx > 0 ? -8 : 0,
                                  overflow: 'hidden',
                                  backgroundColor: '#FFF',
                                }}
                              >
                                <Image
                                  source={{ uri: person.avatar }}
                                  style={{ width: '100%', height: '100%' }}
                                />
                              </View>
                            ))}
                            {bookings.length > 3 && (
                              <View
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 12,
                                  borderWidth: 2,
                                  borderColor: '#FBBF24',
                                  marginLeft: -8,
                                  backgroundColor: '#FEF3C7',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Text style={{ fontSize: 10, fontWeight: '700', color: '#92400E' }}>
                                  +{bookings.length - 3}
                                </Text>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>

                {selectedTime && (
                  <View style={{
                    backgroundColor: '#DCFCE7',
                    borderRadius: 12,
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                    <CheckCircle size={20} color="#22C55E" />
                    <Text style={{ fontSize: 14, color: '#166534', flex: 1 }}>
                      Horário selecionado: <Text style={{ fontWeight: '700' }}>{selectedTime}</Text>
                    </Text>
                  </View>
                )}
              </View>

              {/* Pricing Plans Section - Only for Private Courts */}
              {!isPublic && (
                <>
                  <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 24 }} />
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                    Formas de reserva
                  </Text>
                  <View style={{ gap: 12, marginBottom: 24 }}>
                    {/* Hora Avulsa */}
                    <Pressable style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      backgroundColor: '#F0FDF4',
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: '#22C55E',
                    }}>
                      <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                        <Clock size={20} color="#FFF" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>Hora Avulsa</Text>
                        <Text style={{ fontSize: 13, color: '#6B7280' }}>Reserve por hora</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#22C55E' }}>R$ {court.price || 180}</Text>
                        <Text style={{ fontSize: 12, color: '#6B7280' }}>/hora</Text>
                      </View>
                    </Pressable>

                    {/* Day Use */}
                    <Pressable style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      backgroundColor: '#F9FAFB',
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: '#E5E7EB',
                    }}>
                      <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                        <Calendar size={20} color="#6B7280" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>Day Use</Text>
                        <Text style={{ fontSize: 13, color: '#6B7280' }}>Manhã, Tarde ou Noite</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>A partir de R$ 300</Text>
                        <Text style={{ fontSize: 12, color: '#6B7280' }}>/período</Text>
                      </View>
                    </Pressable>

                    {/* Mensalista */}
                    <Pressable style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      backgroundColor: '#F9FAFB',
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: '#E5E7EB',
                    }}>
                      <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                        <Star size={20} color="#6B7280" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>Mensalista</Text>
                        <Text style={{ fontSize: 13, color: '#6B7280' }}>Horário fixo semanal</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>R$ 600</Text>
                        <Text style={{ fontSize: 12, color: '#6B7280' }}>/mês</Text>
                      </View>
                    </Pressable>
                  </View>
                </>
              )}
            </>
          )}

          {/* ===== MATCHES TAB ===== */}
          {activeTab === 'matches' && (
            <>
              {/* Court Selector - Shows when arena has multiple courts */}
              {hasMultipleCourts && (
                <CourtSelector
                  courts={ARENA_COURTS}
                  selectedCourtId={selectedCourtId}
                  onSelectCourt={handleCourtSelect}
                />
              )}

              {/* Date Selector for matches */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                  Escolha o dia
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10 }}
                >
                  {getNextDays(7).map((date, index) => {
                    const isSelected = selectedDate.toDateString() === date.toDateString();
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedDate(date)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: 12,
                          backgroundColor: isSelected ? '#000' : '#F3F4F6',
                          alignItems: 'center',
                          minWidth: 70,
                        }}
                      >
                        <Text style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: isSelected ? '#FFF' : '#6B7280',
                          textTransform: 'capitalize',
                        }}>
                          {formatDayName(date)}
                        </Text>
                        <Text style={{
                          fontSize: 20,
                          fontWeight: '800',
                          color: isSelected ? '#FFF' : '#000',
                          marginTop: 4,
                        }}>
                          {date.getDate()}
                        </Text>
                        <Text style={{
                          fontSize: 10,
                          color: isSelected ? 'rgba(255,255,255,0.7)' : '#9CA3AF',
                          textTransform: 'capitalize',
                        }}>
                          {date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Schedule Preview - Shows matches happening at this court */}
              <SchedulePreview courtId={id as string} price={court.price ?? undefined} isPublic={isPublic} />

              <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 24 }} />

              {/* Top Players */}
              <TopPlayers />
            </>
          )}

          {/* ===== TOURNAMENTS TAB ===== */}
          {activeTab === 'tournaments' && (
            <>
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#F3F4F6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Trophy size={36} color="#9CA3AF" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 8 }}>
                  Nenhum torneio agendado
                </Text>
                <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', maxWidth: 280 }}>
                  Ainda não há torneios marcados nesta quadra. Fique de olho para as próximas competições!
                </Text>
                <TouchableOpacity style={{
                  marginTop: 20,
                  backgroundColor: '#000',
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 24,
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFF' }}>
                    Criar torneio
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ===== COMMON SECTIONS (All Tabs) ===== */}
          <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 24 }} />

          {/* Description */}
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 12 }}>
            Sobre a quadra
          </Text>
          <Text style={{ fontSize: 15, lineHeight: 24, color: '#374151' }}>
            {court.description || 'Quadra profissional com estrutura completa, oferecendo uma experiência premium para jogadores de todos os níveis.'}
          </Text>

          <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 24 }} />

          {/* Available Sports */}
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 16 }}>
            Esportes disponíveis
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <View style={{ backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <SportIcon sport="beach-tennis" size={18} showBackground={false} />
              <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 14 }}>Beach Tennis</Text>
            </View>
            <View style={{ backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <SportIcon sport="football" size={18} showBackground={false} />
              <Text style={{ color: '#374151', fontWeight: '600', fontSize: 14 }}>Futevôlei</Text>
            </View>
            <View style={{ backgroundColor: '#F3F4F6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <SportIcon sport="volleyball" size={18} showBackground={false} />
              <Text style={{ color: '#374151', fontWeight: '600', fontSize: 14 }}>Vôlei de Praia</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 24 }} />

          {/* Amenities (Only if available) */}
          <View style={{ padding: 20 }}>
            <Text>AmenitiesList Placeholder</Text>
          </View>

          <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 24 }} />

          {/* Info Section */}
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 16 }}>
            Informações
          </Text>
          <View style={{ gap: 16 }}>
            {/* ... Existing Info Rows ... */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Clock size={20} color="#9CA3AF" />
                <Text style={{ fontSize: 15, color: '#374151' }}>Funcionamento</Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#000' }}>06:00 - 22:00</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 20, height: 20, borderWidth: 1.5, borderColor: '#9CA3AF', borderRadius: 4 }} />
                <Text style={{ fontSize: 15, color: '#374151' }}>Tamanho</Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#000' }}>16m x 8m</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={{ fontSize: 16, color: '#9CA3AF' }}>⚡</Text>
                <Text style={{ fontSize: 15, color: '#374151' }}>Piso</Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#000' }}>Areia</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 24 }} />

          {/* Location Map */}
          {/* ... Map Section from previous step ... */}
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 12 }}>
            Localização
          </Text>
          <Text style={{ fontSize: 15, color: '#374151', marginBottom: 16 }}>
            {court.address}
          </Text>
          <View style={{ height: 200, backgroundColor: '#E5E7EB', borderRadius: 16, marginBottom: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
            {/* ... Mock Map Visual ... */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.5, backgroundColor: '#F3F4F6' }}>
              <View style={{ width: '100%', height: '100%', borderBottomWidth: 1, borderColor: '#D1D5DB' }} />
              <View style={{ width: '100%', height: '100%', borderRightWidth: 1, borderColor: '#D1D5DB', position: 'absolute' }} />
            </View>
            <View style={{ backgroundColor: '#000', padding: 12, borderRadius: 24 }}>
              <MapPin color="#FFF" size={24} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* ... Map Buttons ... */}
            <TouchableOpacity style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 24, height: 24, backgroundColor: '#3B82F6', borderRadius: 6, marginBottom: 4, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 14 }}>W</Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '600' }}>Waze</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 24, height: 24, backgroundColor: '#4285F4', borderRadius: 6, marginBottom: 4, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 14 }}>G</Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '600' }}>Google Maps</Text>
            </TouchableOpacity>
          </View>

          {/* Rules - Always Important */}
          <View style={{ marginVertical: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 16 }}>
              Regras da quadra
            </Text>
            {/* ... Rules List ... */}
            <View style={{ gap: 16 }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <CheckCircle size={20} color="#22C55E" />
                <Text style={{ fontSize: 15, color: '#374151', flex: 1 }}>Uso livre por ordem de chegada</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <XCircle size={20} color="#EF4444" />
                <Text style={{ fontSize: 15, color: '#374151', flex: 1 }}>Não é permitido som alto</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 24 }} />

          {/* Reviews */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>Avaliações</Text>
            <Text style={{ fontSize: 14, textDecorationLine: 'underline', color: '#6B7280' }}>Ver todas</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 48, fontWeight: '800', color: '#000', marginRight: 16 }}>4.8</Text>
            <View style={{ flex: 1, gap: 4 }}>
              {REVIEWS_BREAKDOWN.map(item => (
                <View key={item.stars} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', width: 10 }}>{item.stars}</Text>
                  <View style={{ flex: 1, height: 6, backgroundColor: '#F3F4F6', borderRadius: 3 }}>
                    <View style={{ width: `${item.percentage}%`, height: '100%', backgroundColor: '#000', borderRadius: 3 }} />
                  </View>
                  <Text style={{ fontSize: 12, color: '#9CA3AF', width: 24, textAlign: 'right' }}>{item.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ gap: 24 }}>
            {REVIEWS.map(review => (
              <View key={review.id} style={{ backgroundColor: '#F9FAFB', padding: 16, borderRadius: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E5E7EB', marginRight: 12, overflow: 'hidden' }}>
                    <Image source={{ uri: review.avatar_url }} style={{ width: '100%', height: '100%' }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', color: '#000' }}>{review.name}</Text>
                    <Text style={{ fontSize: 12, color: '#6B7280' }}>{review.date}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Star size={14} color="#000" fill="#000" />
                    <Text style={{ fontWeight: '700' }}>{review.rating.toFixed(1)}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 14, color: '#374151', lineHeight: 20 }}>{review.comment}</Text>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>

      {/* Footer Conditional */}
      {
        !isPublic ? (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB',
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: Platform.OS === 'ios' ? insets.bottom + 10 : 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              elevation: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            }}
          >
            <View>
              <Text style={{ fontSize: 16 }}>
                <Text style={{ fontWeight: '800', color: '#000', fontSize: 22 }}>
                  {court.price ? `R$ ${court.price}` : 'Grátis'}
                </Text>
                <Text style={{ color: '#6B7280', fontWeight: '500' }}> / hora</Text>
              </Text>
              <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
                {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} · {selectedTime || 'Selecione'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (canBook) {
                  router.push({
                    pathname: '/court/[id]/book',
                    params: { id: id as string, date: selectedDate.toISOString(), time: selectedTime }
                  });
                }
              }}
              disabled={!canBook}
              style={{
                backgroundColor: '#000',
                borderRadius: 12,
                paddingVertical: 16,
                paddingHorizontal: 40,
                opacity: canBook ? 1 : 0.7
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>
                Reservar
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Public Footer - Show it's free and scroll to schedule */
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB',
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: Platform.OS === 'ios' ? insets.bottom + 10 : 20,
              elevation: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ color: '#166534', fontWeight: '700', fontSize: 14 }}>GRÁTIS</Text>
                </View>
                <Text style={{ color: '#6B7280', fontSize: 14 }}>Quadra pública</Text>
              </View>
              <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
                Escolha um horário acima
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Clock size={18} color="#22C55E" />
              <Text style={{ color: '#22C55E', fontWeight: '700', fontSize: 14 }}>
                {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
              </Text>
            </View>
          </View>
        )
      }

    </View >
  );
}
