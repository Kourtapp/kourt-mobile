import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  MessageCircle,
  UserPlus,
  UserMinus,
  MoreHorizontal,
  MapPin,
  Users,
  Star,
  Flag,
  Ban,
} from 'lucide-react-native';
import { Colors, SPORTS_CONFIG, LEVELS } from '../../constants';
import { MOCK_FRIENDS } from '../../mocks/data';
import { Avatar, Badge, Button, IconButton, ActionSheet } from '../../components/ui';

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find user from mock data
  const user = MOCK_FRIENDS.find((f) => f.id === id) || MOCK_FRIENDS[0];
  const sportConfig = SPORTS_CONFIG[user.favorite_sport as keyof typeof SPORTS_CONFIG];
  const levelConfig = LEVELS[user.level as keyof typeof LEVELS];

  const [isFriend, setIsFriend] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMessage = () => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: user.id, name: user.name },
    });
  };

  const handleFriendToggle = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsFriend(!isFriend);
    setLoading(false);
  };

  const handleReport = () => {
    setShowActions(false);
    Alert.alert(
      'Denunciar usuário',
      'Deseja denunciar este usuário por comportamento inadequado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Denunciar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Denúncia enviada', 'Obrigado por nos ajudar a manter a comunidade segura.');
          },
        },
      ]
    );
  };

  const handleBlock = () => {
    setShowActions(false);
    Alert.alert(
      'Bloquear usuário',
      'Você não poderá mais ver este usuário e ele não poderá entrar em contato com você.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Bloquear',
          style: 'destructive',
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  // Mock stats
  const stats = {
    matches: 47,
    wins: 32,
    friends: 128,
    reviews: 4.8,
  };

  // Mock achievements
  const achievements = [
    { id: '1', icon: '🏆', name: 'Campeão', description: 'Venceu 10 partidas seguidas' },
    { id: '2', icon: '⭐', name: 'Favorito', description: 'Recebeu 50 avaliações 5 estrelas' },
    { id: '3', icon: '🔥', name: 'Em chamas', description: 'Jogou 7 dias seguidos' },
  ];

  // Mock recent games
  const recentGames = [
    { id: '1', sport: 'padel', result: 'win', score: '6-4, 6-3', date: '2 dias atrás' },
    { id: '2', sport: 'tennis', result: 'loss', score: '4-6, 3-6', date: '5 dias atrás' },
    { id: '3', sport: 'padel', result: 'win', score: '6-2, 6-4', date: '1 semana atrás' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 bg-white border-b border-neutral-100">
        <IconButton
          icon={ChevronLeft}
          onPress={() => router.back()}
          variant="default"
          iconColor={Colors.primary}
        />
        <Text className="flex-1 text-xl font-bold text-black text-center">
          Perfil
        </Text>
        <IconButton
          icon={MoreHorizontal}
          onPress={() => setShowActions(true)}
          variant="default"
          iconColor={Colors.neutral[600]}
        />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Profile Header */}
        <View className="bg-white px-5 py-6 items-center border-b border-neutral-100">
          <View className="relative">
            <Avatar fallback={user.name} size="xl" />
            {user.is_online && (
              <View className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white" />
            )}
          </View>

          <Text className="text-2xl font-bold text-black mt-4">{user.name}</Text>

          <View className="flex-row items-center mt-2">
            <MapPin size={14} color={Colors.neutral[500]} />
            <Text className="ml-1 text-neutral-500">São Paulo, SP</Text>
          </View>

          <View className="flex-row items-center gap-2 mt-3">
            <Badge variant="default" size="md">
              {levelConfig?.name || user.level}
            </Badge>
            <Badge variant="default" size="md">
              {sportConfig?.emoji} {sportConfig?.name}
            </Badge>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-6 w-full">
            <Button
              onPress={handleMessage}
              variant="outline"
              size="md"
              icon={MessageCircle}
              className="flex-1"
            >
              Mensagem
            </Button>
            <Button
              onPress={handleFriendToggle}
              variant={isFriend ? 'outline' : 'primary'}
              size="md"
              icon={isFriend ? UserMinus : UserPlus}
              loading={loading}
              className="flex-1"
            >
              {isFriend ? 'Remover' : 'Adicionar'}
            </Button>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row bg-white border-b border-neutral-100">
          <View className="flex-1 items-center py-4 border-r border-neutral-100">
            <Text className="text-2xl font-bold text-black">{stats.matches}</Text>
            <Text className="text-neutral-500 text-sm">Partidas</Text>
          </View>
          <View className="flex-1 items-center py-4 border-r border-neutral-100">
            <Text className="text-2xl font-bold text-black">{stats.wins}</Text>
            <Text className="text-neutral-500 text-sm">Vitórias</Text>
          </View>
          <View className="flex-1 items-center py-4 border-r border-neutral-100">
            <Text className="text-2xl font-bold text-black">{stats.friends}</Text>
            <Text className="text-neutral-500 text-sm">Amigos</Text>
          </View>
          <View className="flex-1 items-center py-4">
            <View className="flex-row items-center">
              <Star size={16} color={Colors.warning} fill={Colors.warning} />
              <Text className="text-2xl font-bold text-black ml-1">{stats.reviews}</Text>
            </View>
            <Text className="text-neutral-500 text-sm">Avaliação</Text>
          </View>
        </View>

        {/* Achievements */}
        <View className="px-5 py-4 bg-white border-b border-neutral-100 mt-2">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-bold text-black text-lg">Conquistas</Text>
            <Pressable>
              <Text className="text-primary font-medium">Ver todas</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                className="bg-neutral-50 rounded-xl px-4 py-3 items-center w-28"
              >
                <Text className="text-3xl mb-2">{achievement.icon}</Text>
                <Text className="font-semibold text-black text-center text-sm">
                  {achievement.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recent Games */}
        <View className="px-5 py-4 bg-white mt-2">
          <Text className="font-bold text-black text-lg mb-4">Partidas recentes</Text>

          <View className="gap-3">
            {recentGames.map((game) => {
              const gameSportConfig = SPORTS_CONFIG[game.sport as keyof typeof SPORTS_CONFIG];
              return (
                <View
                  key={game.id}
                  className="flex-row items-center p-3 bg-neutral-50 rounded-xl"
                >
                  <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: gameSportConfig?.iconBg }}
                  >
                    <Text>{gameSportConfig?.emoji}</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="font-medium text-black">
                      {gameSportConfig?.name}
                    </Text>
                    <Text className="text-neutral-500 text-sm">{game.date}</Text>
                  </View>
                  <View className="items-end">
                    <Badge
                      variant={game.result === 'win' ? 'success' : 'error'}
                      size="sm"
                    >
                      {game.result === 'win' ? 'Vitória' : 'Derrota'}
                    </Badge>
                    <Text className="text-neutral-500 text-sm mt-1">{game.score}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Mutual Friends */}
        <View className="px-5 py-4 bg-white mt-2">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Users size={18} color={Colors.neutral[600]} />
              <Text className="font-bold text-black text-lg ml-2">
                {user.mutual_friends} amigos em comum
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {MOCK_FRIENDS.slice(0, 5).map((friend) => (
              <Pressable
                key={friend.id}
                onPress={() => router.push(`/user/${friend.id}`)}
                className="items-center"
              >
                <Avatar fallback={friend.name} size="md" />
                <Text className="text-neutral-600 text-sm mt-1 w-16 text-center" numberOfLines={1}>
                  {friend.name.split(' ')[0]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Action Sheet */}
      <ActionSheet
        visible={showActions}
        onClose={() => setShowActions(false)}
        title="Opções"
        options={[
          {
            label: 'Denunciar usuário',
            icon: <Flag size={20} color={Colors.error} />,
            onPress: handleReport,
            destructive: true,
          },
          {
            label: 'Bloquear usuário',
            icon: <Ban size={20} color={Colors.error} />,
            onPress: handleBlock,
            destructive: true,
          },
        ]}
      />
    </SafeAreaView>
  );
}
