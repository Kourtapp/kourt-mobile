import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Send, Phone, Video } from 'lucide-react-native';
import { Colors } from '../../constants';
import { Avatar } from '../../components/ui';
import { useMessages, useSendMessage } from '../../hooks/useChat';
import { useAuthStore } from '../../stores/authStore';
import { Message } from '../../services/chat.service';

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
  }>();
  const router = useRouter();
  const { session } = useAuthStore();
  const userId = session?.user?.id || '1';

  const { messages, loading } = useMessages(id);
  const { sendMessage, loading: sending } = useSendMessage();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const participantName = name || 'Conversa';

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;

    const text = inputText.trim();
    setInputText('');

    try {
      await sendMessage(id!, text);
    } catch (err) {
      console.error('Error sending message:', err);
      setInputText(text); // Restore text on error
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMe = item.sender_id === userId;
    const showDate =
      index === 0 ||
      formatDate(item.created_at) !== formatDate(messages[index - 1].created_at);

    return (
      <View>
        {showDate && (
          <View className="items-center my-4">
            <Text className="text-xs text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">
              {formatDate(item.created_at)}
            </Text>
          </View>
        )}
        <View
          className={`flex-row mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
        >
          {!isMe && (
            <Avatar fallback={item.sender?.name || 'U'} size="sm" />
          )}
          <View
            className={`max-w-[75%] px-4 py-3 rounded-2xl ${
              isMe
                ? 'bg-black ml-2 rounded-br-sm'
                : 'bg-neutral-100 ml-2 rounded-bl-sm'
            }`}
          >
            <Text className={isMe ? 'text-white' : 'text-black'}>
              {item.content}
            </Text>
            <Text
              className={`text-xs mt-1 ${
                isMe ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              {formatTime(item.created_at)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-neutral-100">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 bg-neutral-100 rounded-full items-center justify-center mr-3"
        >
          <ChevronLeft size={24} color={Colors.primary} />
        </Pressable>

        <Avatar fallback={participantName} size="md" />

        <View className="flex-1 ml-3">
          <Text className="font-semibold text-black">{participantName}</Text>
          <Text className="text-xs text-success">Online</Text>
        </View>

        <Pressable className="w-10 h-10 bg-neutral-100 rounded-full items-center justify-center mr-2">
          <Phone size={20} color={Colors.neutral[600]} />
        </Pressable>
        <Pressable className="w-10 h-10 bg-neutral-100 rounded-full items-center justify-center">
          <Video size={20} color={Colors.neutral[600]} />
        </Pressable>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-neutral-400">
                {loading ? 'Carregando...' : 'Nenhuma mensagem ainda'}
              </Text>
              <Text className="text-neutral-400 mt-1">
                Diga olá!
              </Text>
            </View>
          }
        />

        {/* Input */}
        <View className="flex-row items-end px-4 py-3 bg-white border-t border-neutral-100">
          <View className="flex-1 flex-row items-end bg-neutral-100 rounded-2xl px-4 py-2 mr-3">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite uma mensagem..."
              placeholderTextColor={Colors.neutral[400]}
              multiline
              maxLength={1000}
              className="flex-1 max-h-24 text-base py-1"
              onSubmitEditing={handleSend}
            />
          </View>
          <Pressable
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              inputText.trim() ? 'bg-black' : 'bg-neutral-200'
            }`}
          >
            <Send
              size={20}
              color={inputText.trim() ? '#fff' : Colors.neutral[400]}
            />
          </Pressable>
        </View>
        <View className="h-6 bg-white" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
