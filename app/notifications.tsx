import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ChevronLeft,
    Bell,
    Users,
    Calendar,
    MessageCircle,
    Heart,
    AlertCircle
} from 'lucide-react-native';
import { Colors } from '../constants';
import { IconButton } from '../components/ui';
import { EmptyState } from '../components/ui/EmptyState';
import { useNotifications, Notification } from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function NotificationsScreen() {
    const router = useRouter();
    const { notifications, loading, refetch, markAsRead, markAllAsRead, unreadCount } = useNotifications();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'match_invite':
                return Calendar;
            case 'match_reminder':
                return AlertCircle;
            case 'follow':
                return Users;
            case 'like':
                return Heart;
            case 'comment':
                return MessageCircle;
            default:
                return Bell;
        }
    };

    const getIconColor = (type: Notification['type']) => {
        switch (type) {
            case 'match_invite':
                return Colors.primary;
            case 'match_reminder':
                return '#f59e0b'; // amber
            case 'follow':
                return '#3b82f6'; // blue
            case 'like':
                return '#ef4444'; // red
            case 'comment':
                return '#10b981'; // green
            default:
                return Colors.neutral[500];
        }
    };

    const getIconBgColor = (type: Notification['type']) => {
        switch (type) {
            case 'match_invite':
                return 'bg-primary/10';
            case 'match_reminder':
                return 'bg-amber-100';
            case 'follow':
                return 'bg-blue-100';
            case 'like':
                return 'bg-red-100';
            case 'comment':
                return 'bg-green-100';
            default:
                return 'bg-neutral-100';
        }
    };

    const handleNotificationPress = async (notification: Notification) => {
        // Mark as read
        if (!notification.read) {
            await markAsRead(notification.id);
        }

        // Navigate based on type
        switch (notification.type) {
            case 'match_invite':
            case 'match_reminder':
                if (notification.data?.match_id) {
                    router.push(`/match/${notification.data.match_id}`);
                }
                break;
            case 'follow':
                if (notification.data?.follower_id) {
                    router.push(`/user/${notification.data.follower_id}`);
                }
                break;
            case 'like':
            case 'comment':
                if (notification.data?.post_id) {
                    router.push(`/post/${notification.data.post_id}`);
                }
                break;
        }
    };

    const formatTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), {
                addSuffix: true,
                locale: ptBR
            });
        } catch {
            return '';
        }
    };

    const renderNotification = ({ item }: { item: Notification }) => {
        const Icon = getNotificationIcon(item.type);
        const iconColor = getIconColor(item.type);
        const iconBgClass = getIconBgColor(item.type);

        return (
            <Pressable
                onPress={() => handleNotificationPress(item)}
                className={`flex-row items-start px-5 py-4 border-b border-neutral-50 ${!item.read ? 'bg-primary/5' : 'bg-white'
                    }`}
                accessible={true}
                accessibilityLabel={`${item.title}. ${item.body}`}
                accessibilityHint={!item.read ? 'Notificação não lida. Toque para ver detalhes' : 'Toque para ver detalhes'}
            >
                {/* Icon */}
                <View className={`w-12 h-12 rounded-full items-center justify-center ${iconBgClass}`}>
                    <Icon size={22} color={iconColor} />
                </View>

                {/* Content */}
                <View className="flex-1 ml-4">
                    <View className="flex-row items-start justify-between">
                        <Text className={`flex-1 text-base ${!item.read ? 'font-bold text-black' : 'font-semibold text-neutral-700'}`}>
                            {item.title}
                        </Text>
                        {!item.read && (
                            <View className="w-2.5 h-2.5 bg-primary rounded-full ml-2 mt-1.5" />
                        )}
                    </View>
                    <Text className="text-sm text-neutral-600 mt-1" numberOfLines={2}>
                        {item.body}
                    </Text>
                    <Text className="text-xs text-neutral-400 mt-2">
                        {formatTime(item.created_at)}
                    </Text>
                </View>
            </Pressable>
        );
    };

    const renderHeader = () => {
        if (unreadCount === 0) return null;

        return (
            <View className="flex-row items-center justify-between px-5 py-3 bg-neutral-50 border-b border-neutral-100">
                <Text className="text-sm text-neutral-600">
                    {unreadCount} {unreadCount === 1 ? 'não lida' : 'não lidas'}
                </Text>
                <Pressable
                    onPress={markAllAsRead}
                    className="px-3 py-1.5 bg-primary/10 rounded-full"
                    accessible={true}
                    accessibilityLabel="Marcar todas como lidas"
                    accessibilityRole="button"
                >
                    <Text className="text-sm font-medium text-primary">Marcar como lidas</Text>
                </Pressable>
            </View>
        );
    };

    if (loading && notifications.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                <View className="flex-row items-center px-5 py-4 border-b border-neutral-100">
                    <IconButton
                        icon={ChevronLeft}
                        onPress={() => router.back()}
                        variant="default"
                        iconColor={Colors.primary}
                        accessibilityLabel="Voltar"
                    />
                    <Text className="flex-1 text-xl font-bold text-black text-center mr-10">
                        Notificações
                    </Text>
                </View>
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text className="text-neutral-500 mt-4">Carregando notificações...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-5 py-4 border-b border-neutral-100">
                <IconButton
                    icon={ChevronLeft}
                    onPress={() => router.back()}
                    variant="default"
                    iconColor={Colors.primary}
                    accessibilityLabel="Voltar"
                />
                <Text className="flex-1 text-xl font-bold text-black text-center mr-10">
                    Notificações
                </Text>
            </View>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderNotification}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={
                    <EmptyState
                        type="noNotifications"
                        title="Nenhuma notificação"
                        description="Você receberá notificações sobre convites para partidas, novos seguidores e atualizações aqui"
                    />
                }
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </SafeAreaView>
    );
}
