import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, MessageCircle, Edit } from 'lucide-react-native';
import { Colors } from '../constants';
import { Avatar } from '../components/ui';
import { useConversations } from '../hooks/useChat';
import { Conversation } from '../services/chat.service';

export default function MessagesScreen() {
  const router = useRouter();
  const { conversations, loading } = useConversations();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const participant = item.participants[0];
    const hasUnread = item.unread_count > 0;

    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/chat/[id]',
            params: {
              id: item.id,
              name: participant?.name,
            },
          })
        }
        className="flex-row items-center px-5 py-4 bg-white border-b border-neutral-50"
      >
        <View className="relative">
          <Avatar fallback={participant?.name || 'U'} size="lg" />
          {hasUnread && (
            <View className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {item.unread_count}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-1 ml-4">
          <View className="flex-row items-center justify-between">
            <Text
              className={`font-semibold ${
                hasUnread ? 'text-black' : 'text-neutral-700'
              }`}
            >
              {participant?.name || 'Usuário'}
            </Text>
            <Text className="text-xs text-neutral-400">
              {item.last_message && formatTime(item.last_message.created_at)}
            </Text>
          </View>
          <Text
            className={`mt-1 ${
              hasUnread ? 'text-black font-medium' : 'text-neutral-500'
            }`}
            numberOfLines={1}
          >
            {item.last_message?.content || 'Inicie uma conversa'}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-neutral-100">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 bg-neutral-100 rounded-full items-center justify-center mr-4"
          >
            <ChevronLeft size={24} color={Colors.primary} />
          </Pressable>
          <Text className="text-xl font-bold text-black">Mensagens</Text>
        </View>
        <Pressable className="w-10 h-10 bg-neutral-100 rounded-full items-center justify-center">
          <Edit size={20} color={Colors.neutral[700]} />
        </Pressable>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 bg-neutral-100 rounded-full items-center justify-center mb-4">
              <MessageCircle size={40} color={Colors.neutral[400]} />
            </View>
            <Text className="text-lg font-semibold text-neutral-700">
              {loading ? 'Carregando...' : 'Nenhuma mensagem'}
            </Text>
            <Text className="text-neutral-500 mt-1 text-center px-10">
              Suas conversas aparecerão aqui
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
