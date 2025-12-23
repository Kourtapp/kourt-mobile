import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, TrendingUp, TrendingDown, Trophy, Clock, Activity, BarChart3 } from 'lucide-react-native';
import { SportIcon } from '../../../components/SportIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type PeriodType = 'week' | 'month' | 'year' | 'all';

interface StatCard {
  label: string;
  value: string | number;
  change?: number;
  icon: 'activity' | 'trophy' | 'chart' | 'clock';
}

export default function StatsScreen() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id } = useLocalSearchParams<{ id: string }>();
  const [period, setPeriod] = useState<PeriodType>('year');

  const stats: Record<PeriodType, { main: StatCard[]; chart: number[] }> = {
    week: {
      main: [
        { label: 'Partidas', value: 5, change: 25, icon: 'activity' },
        { label: 'Vitórias', value: 3, change: 50, icon: 'trophy' },
        { label: 'Win Rate', value: '60%', change: 10, icon: 'chart' },
        { label: 'Tempo Jogado', value: '6h 30m', change: 15, icon: 'clock' },
      ],
      chart: [2, 1, 0, 1, 1, 0, 0],
    },
    month: {
      main: [
        { label: 'Partidas', value: 18, change: 12, icon: 'activity' },
        { label: 'Vitórias', value: 11, change: 22, icon: 'trophy' },
        { label: 'Win Rate', value: '61%', change: 5, icon: 'chart' },
        { label: 'Tempo Jogado', value: '24h 15m', change: 8, icon: 'clock' },
      ],
      chart: [3, 4, 5, 6, 4, 5, 3, 4, 5, 6, 5, 4],
    },
    year: {
      main: [
        { label: 'Partidas', value: 78, change: 35, icon: 'activity' },
        { label: 'Vitórias', value: 52, change: 28, icon: 'trophy' },
        { label: 'Win Rate', value: '67%', change: 12, icon: 'chart' },
        { label: 'Tempo Jogado', value: '156h', change: 42, icon: 'clock' },
      ],
      chart: [5, 8, 6, 9, 7, 8, 10, 6, 7, 8, 9, 5],
    },
    all: {
      main: [
        { label: 'Partidas', value: 234, icon: 'activity' },
        { label: 'Vitórias', value: 156, icon: 'trophy' },
        { label: 'Win Rate', value: '67%', icon: 'chart' },
        { label: 'Tempo Jogado', value: '468h', icon: 'clock' },
      ],
      chart: [15, 28, 36, 49, 57, 68, 70, 76, 87, 98, 109, 105],
    },
  };

  const currentStats = stats[period];
  const maxChartValue = Math.max(...currentStats.chart);

  const sportStats = [
    { sport: 'Beach Tennis', sportKey: 'beach-tennis', matches: 45, wins: 31, winRate: 69 },
    { sport: 'Padel', sportKey: 'padel', matches: 28, wins: 18, winRate: 64 },
    { sport: 'Tênis', sportKey: 'tennis', matches: 5, wins: 3, winRate: 60 },
  ];

  const achievements = [
    { title: 'Primeira Vitória', date: 'Jan 2024', icon: '🏆' },
    { title: '10 Partidas', date: 'Fev 2024', icon: '🎯' },
    { title: '5 Win Streak', date: 'Mar 2024', icon: '🔥' },
    { title: '50 Partidas', date: 'Jun 2024', icon: '⭐' },
    { title: 'Top 10 Ranking', date: 'Set 2024', icon: '📈' },
  ];

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
          Estatísticas
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, gap: 8 }}>
          {[
            { key: 'week', label: 'Semana' },
            { key: 'month', label: 'Mês' },
            { key: 'year', label: 'Ano' },
            { key: 'all', label: 'Total' },
          ].map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setPeriod(tab.key as PeriodType)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: period === tab.key ? '#111827' : '#F3F4F6',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: period === tab.key ? '#fff' : '#6B7280' }}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Main Stats Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 }}>
          {currentStats.main.map((stat, index) => {
            const iconColor = '#6B7280';
            const renderIcon = () => {
              switch (stat.icon) {
                case 'activity': return <Activity size={24} color={iconColor} />;
                case 'trophy': return <Trophy size={24} color={iconColor} />;
                case 'chart': return <BarChart3 size={24} color={iconColor} />;
                case 'clock': return <Clock size={24} color={iconColor} />;
                default: return <Activity size={24} color={iconColor} />;
              }
            };
            return (
              <View
                key={index}
                style={{
                  width: (SCREEN_WIDTH - 40) / 2,
                  backgroundColor: '#FAFAFA',
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  {renderIcon()}
                </View>
                <Text style={{ fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
                  {stat.value}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, color: '#6B7280' }}>{stat.label}</Text>
                  {stat.change !== undefined && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {stat.change >= 0 ? (
                        <TrendingUp size={14} color="#22C55E" />
                      ) : (
                        <TrendingDown size={14} color="#EF4444" />
                      )}
                      <Text style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: stat.change >= 0 ? '#22C55E' : '#EF4444',
                        marginLeft: 4,
                      }}>
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Chart */}
        <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 }}>
            Partidas por {period === 'week' ? 'dia' : period === 'month' ? 'semana' : 'mês'}
          </Text>
          <View style={{ backgroundColor: '#FAFAFA', borderRadius: 16, padding: 16 }}>
            <View style={{ height: 120, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              {currentStats.chart.map((value, index) => (
                <View
                  key={index}
                  style={{
                    width: (SCREEN_WIDTH - 80) / currentStats.chart.length - 4,
                    height: maxChartValue > 0 ? (value / maxChartValue) * 100 : 0,
                    backgroundColor: '#F97316',
                    borderRadius: 4,
                    minHeight: value > 0 ? 8 : 0,
                    opacity: 0.4 + (value / maxChartValue) * 0.6,
                  }}
                />
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              {period === 'week' && ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
                <Text key={i} style={{ fontSize: 11, color: '#9CA3AF' }}>{day}</Text>
              ))}
              {period === 'month' && ['S1', 'S2', 'S3', 'S4'].slice(0, Math.min(4, currentStats.chart.length)).map((week, i) => (
                <Text key={i} style={{ fontSize: 11, color: '#9CA3AF' }}>{week}</Text>
              ))}
              {(period === 'year' || period === 'all') && ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, i) => (
                <Text key={i} style={{ fontSize: 11, color: '#9CA3AF' }}>{month}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* Stats by Sport */}
        <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 }}>
            Por Esporte
          </Text>
          {sportStats.map((sport, index) => (
            <View
              key={index}
              style={{
                backgroundColor: '#FAFAFA',
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ marginRight: 12 }}>
                  <SportIcon sport={sport.sportKey} size={32} showBackground={false} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', flex: 1 }}>{sport.sport}</Text>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>{sport.matches} partidas</Text>
              </View>

              {/* Win Rate Bar */}
              <View style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 13, color: '#6B7280' }}>Win Rate</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#22C55E' }}>{sport.winRate}%</Text>
                </View>
                <View style={{ height: 8, backgroundColor: '#E5E7EB', borderRadius: 4 }}>
                  <View style={{
                    height: 8,
                    width: `${sport.winRate}%`,
                    backgroundColor: '#22C55E',
                    borderRadius: 4
                  }} />
                </View>
              </View>

              <Text style={{ fontSize: 13, color: '#6B7280' }}>
                {sport.wins} vitórias • {sport.matches - sport.wins} derrotas
              </Text>
            </View>
          ))}
        </View>

        {/* Recent Achievements */}
        <View style={{ marginTop: 24, paddingHorizontal: 16, paddingBottom: 40 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 }}>
            Conquistas Recentes
          </Text>
          <View style={{ backgroundColor: '#FAFAFA', borderRadius: 16, overflow: 'hidden' }}>
            {achievements.map((achievement, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderBottomWidth: index < achievements.length - 1 ? 1 : 0,
                  borderBottomColor: '#E5E7EB',
                }}
              >
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}>
                  <Text style={{ fontSize: 20 }}>{achievement.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>{achievement.title}</Text>
                  <Text style={{ fontSize: 13, color: '#6B7280' }}>{achievement.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
