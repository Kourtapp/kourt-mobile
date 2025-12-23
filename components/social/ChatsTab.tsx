import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useConversations } from '@/hooks/useChat';
import { Avatar } from '@/components/ui';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ChatsTab() {
    const { conversations, loading, refetch } = useConversations();

    if (loading && conversations.length === 0) {
        return (
            <View className="flex-1 items-center justify-center p-10">
                <ActivityIndicator color="black" />
            </View>
        );
    }

    return (
        <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            refreshing={loading}
            onRefresh={refetch}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <EmptyState
                    type="noChats"
                    title="Nenhuma conversa"
                    description="Suas conversas com outros jogadores aparecerão aqui."
                />
            }
            renderItem={({ item }) => {
                const participant = item.participants[0];
                const name = participant?.name || 'Usuário Kourt';

                return (
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: '/chat/[id]',
                            params: {
                                id: item.id,
                                name: name,
                            }
                        })}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel={`Conversa com ${name}. ${item.last_message?.content || 'Nenhuma mensagem ainda'}${item.unread_count > 0 ? `. ${item.unread_count} mensagens não lidas` : ''}`}
                        accessibilityHint="Toque duas vezes para abrir a conversa"
                    >
                        <View className="flex-row items-center px-5 py-4 bg-white border-b border-neutral-50 active:bg-neutral-50" accessible={false}>
                            <View className="mr-3" accessibilityElementsHidden={true}>
                                <Avatar fallback={name} size="md" />
                            </View>
                            <View className="flex-1" accessibilityElementsHidden={true}>
                                <View className="flex-row justify-between mb-1">
                                    <Text className="font-bold text-black text-[15px]">{name}</Text>
                                    {item.last_message && (
                                        <Text className="text-xs text-neutral-400">
                                            {formatDistanceToNow(new Date(item.last_message.created_at), { addSuffix: true, locale: ptBR }).replace('aproximadamente ', '')}
                                        </Text>
                                    )}
                                </View>
                                <View className="flex-row justify-between items-center">
                                    <Text
                                        className={`text-sm flex-1 mr-4 ${item.unread_count > 0 ? 'text-black font-semibold' : 'text-neutral-500'}`}
                                        numberOfLines={1}
                                    >
                                        {item.last_message?.content || 'Inicie a conversa'}
                                    </Text>
                                    {item.unread_count > 0 && (
                                        <View className="bg-blue-500 min-w-[20px] h-5 rounded-full items-center justify-center px-1" accessible={true} accessibilityLabel={`${item.unread_count} mensagens não lidas`}>
                                            <Text className="text-white text-[10px] font-bold">{item.unread_count}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );
}
