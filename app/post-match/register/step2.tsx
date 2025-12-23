import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, Check } from 'lucide-react-native';
import { RegisterHeader } from '@/components/post-match/RegisterHeader';
import { usePostMatch } from './PostMatchContext';

const SPORTS = [
  { id: 'beachtennis', label: 'BeachTennis', icon: '🎾' },
  { id: 'padel', label: 'Padel', icon: '🎾' },
  { id: 'tennis', label: 'Tênis', icon: '🎾' },
  { id: 'soccer', label: 'Futebol', icon: '⚽' },
  { id: 'volley', label: 'Vôlei', icon: '🏐' },
  { id: 'basketball', label: 'Basquete', icon: '🏀' },
];

const DURATIONS = ['30min', '1h', '1h30', '2h'];

export default function RegisterStep2() {
  const router = useRouter();
  const { data, updateData } = usePostMatch();
  const [selectedSport, setSelectedSport] = useState(data.sport);
  const [selectedDuration, setSelectedDuration] = useState(data.duration);
  const [locationType, setLocationType] = useState<'gps' | 'search'>('gps');

  // Update context when values change
  useEffect(() => {
    updateData({ sport: selectedSport, duration: selectedDuration });
  }, [selectedSport, selectedDuration]);

  const handleNext = () => {
    router.push('/post-match/register/step3');
  };

  return (
    <View className="flex-1 bg-white">
      <RegisterHeader title="Esporte e Local" step={2} />

      <ScrollView className="flex-1 px-5 pt-2" showsVerticalScrollIndicator={false}>

        {/* Section: Sport */}
        <Text className="text-base font-bold text-gray-900 mb-3 mt-4">Qual esporte você jogou?</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {SPORTS.map((sport) => {
            const isSelected = selectedSport === sport.id;
            return (
              <Pressable
                key={sport.id}
                onPress={() => setSelectedSport(sport.id)}
                className={`w-[31%] aspect-square rounded-2xl items-center justify-center border ${isSelected ? 'bg-black border-black' : 'bg-white border-gray-200'
                  }`}
              >
                <Text className="text-5xl mb-1 text-center leading-[60px]" style={{ includeFontPadding: false }}>{sport.icon}</Text>
                <Text
                  className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}
                >
                  {sport.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Section: Location */}
        <Text className="text-base font-bold text-gray-900 mb-3">Onde você jogou?</Text>

        {/* GPS Card */}
        <Pressable
          onPress={() => setLocationType('gps')}
          className={`flex-row items-center p-4 rounded-xl border mb-3 ${locationType === 'gps' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-transparent'
            }`}
        >
          <View className="w-10 h-10 bg-green-100 rounded-lg items-center justify-center mr-3">
            <MapPin size={20} color="#15803d" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-gray-900">Arena BeachIbirapuera</Text>
            <View className="flex-row items-center">
              <MapPin size={12} color="#dc2626" className="mr-1" />
              <Text className="text-xs text-green-700 font-medium">Detectado por GPS</Text>
            </View>
          </View>
          {locationType === 'gps' && (
            <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center">
              <Check size={14} color="#FFF" />
            </View>
          )}
        </Pressable>

        {/* Search Input */}
        <View className="flex-row items-center border border-gray-200 rounded-xl h-12 px-3 mb-6">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Buscar outra quadra..."
            className="flex-1 ml-2 text-base text-gray-900"
            onFocus={() => setLocationType('search')}
          />
        </View>

        {/* Section: Date & Time */}
        <Text className="text-base font-bold text-gray-900 mb-3">Quando você jogou?</Text>
        <View className="flex-row gap-3 mb-6">
          {/* Date */}
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-1 ml-1">Data</Text>
            <Pressable className="flex-row items-center border border-gray-200 rounded-xl h-12 px-3 bg-gray-50">
              <Calendar size={18} color="#6B7280" />
              <Text className="ml-2 font-semibold text-gray-900">Hoje</Text>
            </Pressable>
          </View>
          {/* Time */}
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-1 ml-1">Horário</Text>
            <Pressable className="flex-row items-center border border-gray-200 rounded-xl h-12 px-3 bg-gray-50">
              <Clock size={18} color="#6B7280" />
              <Text className="ml-2 font-semibold text-gray-900">18:00</Text>
            </Pressable>
          </View>
        </View>

        {/* Section: Duration */}
        <Text className="text-base font-bold text-gray-900 mb-3">Quanto tempo jogou?</Text>
        <View className="flex-row justify-between gap-2 mb-8">
          {DURATIONS.map(dur => {
            const isSelected = selectedDuration === dur;
            return (
              <Pressable
                key={dur}
                onPress={() => setSelectedDuration(dur)}
                className={`flex-1 h-10 items-center justify-center rounded-lg ${isSelected ? 'bg-black' : 'bg-gray-100'
                  }`}
              >
                <Text className={`font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {dur}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {/* Spacer for bottom button */}
        <View className="h-20" />

      </ScrollView>

      {/* Footer / Next Button */}
      <View className="absolute bottom-0 left-0 right-0 p-5 pb-8 bg-white border-t border-gray-100">
        <Pressable
          className="w-full bg-black h-14 rounded-full items-center justify-center active:opacity-90"
          onPress={handleNext}
        >
          <Text className="text-white font-bold text-lg">Próximo</Text>
        </Pressable>
      </View>
    </View>
  );
}
